import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { build } from 'esbuild';

// Pinned public model assets. Player browsers never contact the model hub.
const repository = 'Xenova/all-MiniLM-L6-v2';
const revision = '751bff37182d3f1213fa05d7196b954e230abad9';
const root = resolve('public/language/v1');
const modelRoot = resolve(root, 'all-MiniLM-L6-v2');
const files = ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'special_tokens_map.json', 'onnx/model_quantized.onnx', 'README.md'];
await mkdir(resolve(modelRoot, 'onnx'), { recursive: true });
await mkdir(resolve(root, 'runtime'), { recursive: true });
const treeResponse = await fetch(`https://huggingface.co/api/models/${repository}/tree/${revision}/onnx`);
if (!treeResponse.ok) throw new Error(`Model metadata HTTP ${treeResponse.status}`);
const tree = await treeResponse.json();
const expected = tree.find(file => file.path === 'onnx/model_quantized.onnx')?.lfs?.oid;
if (!expected) throw new Error('The pinned model has no weight checksum.');
const assets = [];
for (const name of files) {
  const response = await fetch(`https://huggingface.co/${repository}/resolve/${revision}/${name}`);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const body = Buffer.from(await response.arrayBuffer());
  const sha256 = createHash('sha256').update(body).digest('hex');
  if (name.endsWith('.onnx') && sha256 !== expected) throw new Error('Model checksum mismatch.');
  await writeFile(resolve(modelRoot, name), body);
  assets.push({ path: `all-MiniLM-L6-v2/${name}`, bytes: body.length, sha256 });
}
for (const name of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) {
  const source = resolve('node_modules/onnxruntime-web/dist', name);
  await copyFile(source, resolve(root, 'runtime', name));
  const body = await readFile(source);
  assets.push({ path: `runtime/${name}`, bytes: body.length, sha256: createHash('sha256').update(body).digest('hex') });
}
await build({ stdin: { contents: "export { env, pipeline } from '@huggingface/transformers';", resolveDir: process.cwd() }, bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true, alias: { 'onnxruntime-web': 'onnxruntime-web/wasm' }, outfile: resolve(root, 'runtime/transformers.mjs') });
const runtimeBody = await readFile(resolve(root, 'runtime/transformers.mjs'));
assets.push({ path: 'runtime/transformers.mjs', bytes: runtimeBody.length, sha256: createHash('sha256').update(runtimeBody).digest('hex') });
const licence = await fetch('https://www.apache.org/licenses/LICENSE-2.0.txt');
if (!licence.ok) throw new Error('Model licence download failed.');
await writeFile(resolve(modelRoot, 'LICENSE.txt'), await licence.text());
const ortCommit = (await readFile(resolve('node_modules/onnxruntime-web/__commit.txt'), 'utf8')).trim();
const ortLicence = await fetch(`https://raw.githubusercontent.com/microsoft/onnxruntime/${ortCommit}/LICENSE`);
if (!ortLicence.ok) throw new Error('ONNX Runtime licence download failed.');
await writeFile(resolve(root, 'runtime/LICENSE.txt'), await ortLicence.text());
await copyFile(resolve('node_modules/@huggingface/transformers/LICENSE'), resolve(root, 'runtime/TRANSFORMERS-LICENSE.txt'));
await writeFile(resolve(root, 'manifest.json'), JSON.stringify({ repository, revision, dtype: 'q8', runtime: 'Transformers.js 3.8.1 / ONNX Runtime Web', assets, downloadBytes: assets.reduce((sum, asset) => sum + asset.bytes, 0) }, null, 2) + '\n');
console.log(JSON.stringify({ repository, revision, bytes: assets.reduce((sum, asset) => sum + asset.bytes, 0), assets: assets.length }));
