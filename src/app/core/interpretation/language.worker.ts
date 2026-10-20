/// <reference lib="webworker" />
import { CATALOG_VERSION, SEMANTIC_EXAMPLES } from './semantic-catalog';
import { rankIntents, recognitionText, selectMeaning } from './semantic';
import { LanguageRequest, LanguageResponse } from './language-protocol';

interface Asset { path: string; bytes: number; sha256: string }
interface Manifest { repository: string; revision: string; assets: Asset[]; downloadBytes: number }
interface Embeddings { version: number; texts: string[]; vectors: number[][] }
type Extractor = (text: string, options: { pooling: string; normalize: boolean }) => Promise<{ tolist(): number[][] }>;
let extractor: Extractor | undefined;
let vectors: number[][] = [];
let loading = false;
const send = (response: LanguageResponse): void => postMessage(response);

async function load(root: string): Promise<void> {
  const started = performance.now();
  const base = new URL(root);
  if (base.origin !== location.origin || base.pathname !== '/language/v1/') throw new Error('Invalid model location.');
  let cache: Cache | undefined;
  try { cache = await caches.open('nerve-ending-language-v1'); } catch { /* Memory-only operation is supported. */ }
  const manifestUrl = new URL('manifest.json', base).href;
  let manifestResponse: Response | undefined;
  try {
    manifestResponse = await fetch(manifestUrl, { signal: AbortSignal.timeout(15000), cache: 'no-cache' });
    if (!manifestResponse.ok) throw new Error('Model manifest unavailable.');
    try { await cache?.put(manifestUrl, manifestResponse.clone()); } catch { cache = undefined; }
  } catch { manifestResponse = await cache?.match(manifestUrl); }
  if (!manifestResponse) throw new Error('Model files are not cached.');
  const manifest = await manifestResponse.json() as Manifest;
  if (manifest.repository !== 'Xenova/all-MiniLM-L6-v2' || manifest.revision !== '751bff37182d3f1213fa05d7196b954e230abad9' || !Array.isArray(manifest.assets)) throw new Error('Wrong model version.');
  const files = new Map<string, Uint8Array>();
  let loaded = 0; let lastProgress = 0;
  for (const asset of manifest.assets) {
    const url = new URL(asset.path, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname) || asset.bytes > 25_000_000) throw new Error('Invalid model asset.');
    const key = `${url.href}?sha=${asset.sha256}`;
    let response: Response | undefined;
    try { response = await cache?.match(key); } catch { cache = undefined; }
    const cached = !!response;
    if (!response) response = await fetch(url, { signal: AbortSignal.timeout(90000) });
    if (!response.ok || !response.body) throw new Error('Model download failed.');
    const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let length = 0;
    for (;;) {
      const chunk = await reader.read(); if (chunk.done) break;
      chunks.push(chunk.value); length += chunk.value.length;
      if (length > asset.bytes) throw new Error('Unexpected model file size.');
      if (performance.now() - lastProgress > 80) { send({ type: 'progress', loaded: loaded + length, total: manifest.downloadBytes, cached }); lastProgress = performance.now(); }
    }
    if (length !== asset.bytes) throw new Error('Incomplete model download.');
    const body = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    files.set(url.href, body); loaded += length;
    if (!cached) { try { await cache?.put(key, new Response(body, { headers: { 'Content-Type': asset.path.endsWith('.json') ? 'application/json' : 'application/octet-stream' } })); } catch { cache = undefined; } }
    send({ type: 'progress', loaded, total: manifest.downloadBytes, cached });
  }
  send({ type: 'initializing', detail: 'Loading local processor…' });
  const read = (path: string): Uint8Array => { const body = files.get(new URL(path, base).href); if (!body) throw new Error('Required model asset missing.'); return body; };
  const moduleUrl = URL.createObjectURL(new Blob([read('runtime/transformers.mjs') as BlobPart], { type: 'application/javascript' }));
  const factoryUrl = URL.createObjectURL(new Blob([read('runtime/ort-wasm-simd-threaded.mjs') as BlobPart], { type: 'application/javascript' }));
  const wasmUrl = URL.createObjectURL(new Blob([read('runtime/ort-wasm-simd-threaded.wasm') as BlobPart], { type: 'application/wasm' }));
  const runtime = await import(/* @vite-ignore */ moduleUrl);
  send({ type: 'initializing', detail: 'Reading sentence model…' });
  runtime.env.allowRemoteModels = false; runtime.env.allowLocalModels = true;
  runtime.env.localModelPath = base.href;
  runtime.env.useBrowserCache = false; runtime.env.useFSCache = false; runtime.env.useFS = false;
  runtime.env.useCustomCache = true;
  runtime.env.customCache = {
    match: async (request: string): Promise<Response | undefined> => {
      const body = files.get(new URL(request, base).href);
      return body ? new Response(body as BodyInit) : undefined;
    },
    put: async (): Promise<void> => {},
  };
  runtime.env.backends.onnx.wasm.numThreads = 1;
  runtime.env.backends.onnx.wasm.proxy = false;
  runtime.env.backends.onnx.wasm.initTimeout = 15000;
  runtime.env.backends.onnx.wasm.wasmPaths = { mjs: factoryUrl, wasm: wasmUrl };
  extractor = await runtime.pipeline('feature-extraction', 'all-MiniLM-L6-v2', { dtype: 'q8', device: 'wasm', local_files_only: true });
  send({ type: 'initializing', detail: 'Checking first question…' });
  const references = JSON.parse(new TextDecoder().decode(read('embeddings.json'))) as Embeddings;
  if (references.version !== CATALOG_VERSION || references.texts.join('\n') !== SEMANTIC_EXAMPLES.map(example => example.text).join('\n')) throw new Error('Question catalogue mismatch.');
  vectors = references.vectors;
  await extractor!('Ready', { pooling: 'mean', normalize: true });
  URL.revokeObjectURL(moduleUrl);
  URL.revokeObjectURL(factoryUrl); URL.revokeObjectURL(wasmUrl);
  files.clear();
  send({ type: 'ready', loadMs: performance.now() - started, persistent: !!cache });
}

addEventListener('message', async ({ data }: MessageEvent<LanguageRequest>) => {
  try {
    if (data.type === 'load') { if (loading) return; loading = true; await load(data.root); }
    else {
      if (!extractor) throw new Error('Not ready.');
      const started = performance.now();
      const embedding = await extractor(recognitionText(data.input.slice(0, 1000)), { pooling: 'mean', normalize: true });
      const interpretation = selectMeaning(data.input, data.context, rankIntents(embedding.tolist()[0], vectors));
      send({ type: 'result', id: data.id, interpretation, elapsedMs: performance.now() - started });
    }
  } catch (error) { send({ type: 'error', detail: error instanceof Error ? error.message.slice(0, 250) : 'Local processor failed.', ...(data.type === 'query' ? { id: data.id } : {}) }); }
});
