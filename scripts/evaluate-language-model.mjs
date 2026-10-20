import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { env, pipeline } from '@huggingface/transformers';

await mkdir('tmp/model-evaluation', { recursive: true });
const modulePath = resolve('tmp/model-evaluation/recognition.mjs');
await build({ stdin: { contents: "export * from './src/app/core/interpretation/semantic'; export * from './src/app/core/interpretation/semantic-catalog'; export { classify } from './src/app/core/interpretation/fallback';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: modulePath });
const { SEMANTIC_EXAMPLES, CATALOG_VERSION, rankIntents, selectMeaning, recognitionText, classify } = await import(pathToFileURL(modulePath).href);
env.allowRemoteModels = false; env.allowLocalModels = true;
env.localModelPath = resolve('public/language/v1') + '/'; env.useFSCache = false;
const started = performance.now();
const embed = await pipeline('feature-extraction', 'all-MiniLM-L6-v2', { dtype: 'q8', device: 'cpu', local_files_only: true });
const texts = SEMANTIC_EXAMPLES.map(example => example.text);
let vectors;
if (process.argv.includes('--write-embeddings')) {
  vectors = [];
  for (let index = 0; index < texts.length; index += 16) vectors.push(...(await embed(texts.slice(index, index + 16), { pooling: 'mean', normalize: true })).tolist());
  vectors = vectors.map(row => row.map(value => +value.toFixed(7)));
  const body = Buffer.from(JSON.stringify({ version: CATALOG_VERSION, texts, vectors }));
  await writeFile('public/language/v1/embeddings.json', body);
  const manifest = JSON.parse(await readFile('public/language/v1/manifest.json', 'utf8'));
  manifest.assets = manifest.assets.filter(asset => asset.path !== 'embeddings.json');
  manifest.assets.push({ path: 'embeddings.json', bytes: body.length, sha256: createHash('sha256').update(body).digest('hex') });
  manifest.downloadBytes = manifest.assets.reduce((sum, asset) => sum + asset.bytes, 0);
  await writeFile('public/language/v1/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
} else {
  const references = JSON.parse(await readFile('public/language/v1/embeddings.json', 'utf8'));
  if (references.version !== CATALOG_VERSION || references.texts.join('\n') !== texts.join('\n')) throw new Error('Run --write-embeddings after changing recognition examples.');
  vectors = references.vectors;
}
const cases = JSON.parse(await readFile('tests/language-evaluation.json', 'utf8'));
const results = [];
for (const item of cases) {
  const began = performance.now();
  const vector = (await embed(recognitionText(item.input), { pooling: 'mean', normalize: true })).tolist()[0];
  const ranked = rankIntents(vector, vectors);
  const result = selectMeaning(item.input, item.context ?? {}, ranked);
  const sameMeaning = result.intent === item.intent || result.intent === 'ask_transfer' && item.intent === 'ask_archive_location';
  const passed = item.clarify ? result.needsClarification : !result.needsClarification && sameMeaning && (!item.fileId || result.fileId === item.fileId);
  results.push({ ...item, result, passed, ms: +(performance.now() - began).toFixed(1), ranking: ranked.slice(0, 3) });
}
const passed = results.filter(result => result.passed).length;
const baseline = cases.filter(item => { const result = classify(item.input, item.context); return item.clarify ? result.needsClarification : !result.needsClarification && result.intent === item.intent && (!item.fileId || result.fileId === item.fileId); }).length;
const summary = { cases: cases.length, passed, baseline, modelAndEvaluationMs: Math.round(performance.now() - started), meanInferenceMs: +(results.reduce((sum, item) => sum + item.ms, 0) / results.length).toFixed(1) };
await writeFile('tmp/language-evaluation.json', JSON.stringify({ summary, results }, null, 2) + '\n');
console.log(JSON.stringify(summary));
for (const item of results.filter(result => !result.passed)) console.log(JSON.stringify({ input: item.input, expected: item.intent ?? 'clarification', got: item.result, ranking: item.ranking }));
await embed.dispose();
if (passed < cases.length) process.exitCode = 1;
