import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, sep } from 'node:path';
const root = resolve('public/language/v1');
const manifest = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
if (manifest.repository !== 'Xenova/all-MiniLM-L6-v2' || manifest.revision !== '751bff37182d3f1213fa05d7196b954e230abad9' || !manifest.assets.some(asset => asset.path === 'embeddings.json')) throw new Error('Missing or incorrect model preparation.');
let bytes = 0;
for (const asset of manifest.assets) {
  const path = resolve(root, asset.path);
  if (!path.startsWith(root + sep)) throw new Error('Invalid model asset path.');
  const body = await readFile(path); bytes += body.length;
  if (body.length !== asset.bytes || createHash('sha256').update(body).digest('hex') !== asset.sha256) throw new Error(`Model asset mismatch: ${asset.path}`);
  if (body.length > 25_000_000) throw new Error(`Model asset exceeds static hosting limit: ${asset.path}`);
}
if (manifest.downloadBytes !== bytes) throw new Error('Incorrect download size.');
console.log(JSON.stringify({ verifiedAssets: manifest.assets.length, downloadBytes: bytes, modelRevision: manifest.revision }));
