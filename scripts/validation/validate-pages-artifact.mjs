import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';

// Validate the directory passed to upload-pages-artifact, never the repository or dist parent.
const artifact = process.argv[3] ?? 'dist/client';
const root = resolve(artifact);
const base = process.argv[2] ?? '/nerve-ending-project/';
assert.match(base, /^\/(?:[a-zA-Z0-9_-]+\/)*$/);
const origin = 'https://3vilbonobo.github.io';
const page = new URL(base, origin);
const digest = (body, algorithm = 'sha256') => createHash(algorithm).update(body).digest('hex');
const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const localFile = url => {
  const target = new URL(url, page);
  assert.equal(target.origin, origin, `External deployment asset: ${target}`);
  assert.ok(target.pathname.startsWith(base), `Asset escapes deployment base: ${target}`);
  const path = resolve(root, decodeURIComponent(target.pathname.slice(base.length)));
  assert.ok(path.startsWith(root + sep), `Invalid deployment asset: ${target}`);
  return path;
};
const html = await readFile(resolve(root, 'index.html'), 'utf8');
assert.match(html, /<ne-root[\s>]/, 'Artifact must contain the Angular host');
assert.doesNotMatch(html, /Jekyll|markdown-body/, 'Artifact must not be the rendered README');
assert.equal(html.match(/<base href="([^"]+)"/)?.[1], base, 'Incorrect Angular base href');
const entries = await readdir(root, { withFileTypes: true });
for (const entry of entries) {
  assert.ok(!entry.isSymbolicLink(), `Symlink in deployment: ${entry.name}`);
  const allowed = entry.isDirectory()
    ? ['bitmaps', 'fonts', 'icons', 'language', 'media'].includes(entry.name)
    : /^(?:index\.html|manifest\.webmanifest|ngsw\.json|ngsw-worker\.js|safety-worker\.js|worker-basic\.min\.js|(?:main|polyfills|chunk|worker|styles)-[\w-]+\.(?:js|css))$/.test(entry.name);
  assert.ok(allowed, `Unexpected file/directory in deployment root: ${entry.name}`);
}
const referenced = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)].map(match => match[1]);
assert.ok(referenced.some(url => /^main-[\w-]+\.js$/.test(url)), 'No compiled Angular entry point');
assert.ok(referenced.some(url => /^styles-[\w-]+\.css$/.test(url)), 'No compiled stylesheet');
for (const url of referenced) await readFile(localFile(url));
const styles = entries.filter(entry => entry.name.endsWith('.css'));
let cssAssets = 0;
for (const entry of styles) {
  const css = await readFile(resolve(root, entry.name), 'utf8');
  for (const match of css.matchAll(/url\((?:["']?)([^\s)"']+)(?:["']?)\)/g)) {
    if (match[1].startsWith('data:')) continue;
    await readFile(localFile(match[1])); cssAssets++;
  }
}
assert.ok(cssAssets > 0, 'Missing local font');
const workers = entries.filter(entry => /^worker-[\w-]+\.js$/.test(entry.name));
assert.ok(workers.length > 0, 'Missing compiled local AI worker');

// Public assets must be byte-for-byte copies, including all images, model weights and WASM.
let publicFiles = 0;
async function comparePublic(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.ok(!entry.isSymbolicLink(), `Symlink in public assets: ${entry.name}`);
    const source = resolve(directory, entry.name);
    if (entry.isDirectory()) { await comparePublic(source); continue; }
    const path = relative(resolve('public'), source);
    assert.equal(digest(await readFile(resolve(root, path))), digest(await readFile(source)), `Copied asset mismatch: ${path}`);
    publicFiles++;
  }
}
await comparePublic(resolve('public'));
const model = await json('language/v1/manifest.json');
assert.equal(model.repository, 'Xenova/all-MiniLM-L6-v2');
assert.equal(model.revision, '751bff37182d3f1213fa05d7196b954e230abad9');
for (const required of ['embeddings.json', 'all-MiniLM-L6-v2/onnx/model_quantized.onnx', 'runtime/transformers.mjs', 'runtime/ort-wasm-simd-threaded.mjs', 'runtime/ort-wasm-simd-threaded.wasm']) {
  assert.ok(model.assets.some(asset => asset.path === required), `Missing model component: ${required}`);
}
let modelBytes = 0;
for (const asset of model.assets) {
  assert.match(asset.path, /^[a-zA-Z0-9_./-]+$/);
  assert.ok(!asset.path.split('/').includes('..') && !asset.path.startsWith('/'));
  const body = await readFile(localFile(`language/v1/${asset.path}`));
  assert.equal(body.length, asset.bytes, `Model size: ${asset.path}`);
  assert.equal(digest(body), asset.sha256, `Model checksum: ${asset.path}`);
  modelBytes += body.length;
}
assert.equal(modelBytes, model.downloadBytes);
const manifest = await json('manifest.webmanifest');
for (const field of ['id', 'start_url', 'scope']) assert.equal(new URL(manifest[field], page).href, page.href, `PWA ${field} escapes project`);
for (const icon of manifest.icons) await readFile(localFile(icon.src));
const sw = await json('ngsw.json');
assert.equal(sw.index, `${base}index.html`, 'Service worker index escapes project');
for (const [url, checksum] of Object.entries(sw.hashTable)) {
  assert.ok(!url.includes('/language/'), 'Optional AI model must not be prefetched');
  assert.equal(digest(await readFile(localFile(url)), 'sha1'), checksum, `Service worker checksum: ${url}`);
}
for (const entry of entries.filter(entry => /\.(?:css|js)$/.test(entry.name) && !['ngsw-worker.js', 'safety-worker.js', 'worker-basic.min.js'].includes(entry.name))) {
  assert.ok(sw.hashTable[`${base}${entry.name}`], `Uncached app bundle: ${entry.name}`);
}
for (const path of ['index.html', 'manifest.webmanifest', 'bitmaps/demo-employee-id.png', 'bitmaps/demo-equipment-layout.png', 'bitmaps/demo-equipment-room.png']) {
  assert.ok(sw.hashTable[`${base}${path}`], `Uncached app asset: ${path}`);
}
for (const entry of await readdir(resolve(root, 'media'))) assert.ok(sw.hashTable[`${base}media/${entry}`], `Uncached font: ${entry}`);
console.log(JSON.stringify({ artifact, base, publicFiles, cssAssets, workers: workers.length, serviceWorkerFiles: Object.keys(sw.hashTable).length, modelAssets: model.assets.length, modelBytes }, null, 2));
