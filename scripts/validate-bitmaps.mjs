import assert from 'node:assert/strict';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inflateSync } from 'node:zlib';
import { build } from 'esbuild';
import { fixtureAssets, PALETTE, processBitmap } from './bitmap-fixtures.mjs';

// Pipeline checks are run outside the browser bundle. No image library or network is needed.
const gray = { width: 4, height: 1, rgb: Uint8Array.from([0,0,0,85,85,85,170,170,170,255,255,255]) };
assert.deepEqual([...processBitmap(gray, 4, 1).pixels], [0,1,2,3]);
assert.deepEqual([...processBitmap({ width: 3, height: 1, rgb: Uint8Array.from([255,0,0,0,255,0,0,0,255]) }, 3, 1).pixels], [1,2,0], 'RGB is converted by luminance, not by a CSS color filter.');
assert.deepEqual([...processBitmap(gray, 8, 1).pixels], [0,0,1,1,2,2,3,3], 'Nearest-source enlargement preserves square blocks.');
const flat = { width: 1, height: 1, rgb: Uint8Array.from([100,100,100]) };
assert.deepEqual(processBitmap(flat, 16, 16, true), processBitmap(flat, 16, 16, true));
assert.equal(new Set(processBitmap(flat, 16, 16, true).pixels).size, 2);
assert.throws(() => processBitmap(gray, 0, 1));
assert.throws(() => processBitmap({ width: 2, height: 2, rgb: [] }, 1, 1));

await mkdir('tmp/bitmap-validation', { recursive: true });
const bundle = resolve('tmp/bitmap-validation/records.mjs');
await build({ stdin: { contents: "export * from './src/app/core/bitmap-records'; export * from './src/app/core/content';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: bundle });
const g = await import(pathToFileURL(bundle).href);
assert.equal(g.BITMAP_FILES.length, 3); assert.equal(g.FILES.filter(file => file.bitmap).length, 3);
const fixtures = fixtureAssets(); let totalBytes = 0;
for (const fixture of fixtures) {
  const record = g.BITMAP_FILES.find(file => file.bitmap.asset === `/bitmaps/${fixture.name}.png`);
  assert.ok(record); assert.equal(record.bitmap.artwork, 'placeholder'); assert.equal(record.bitmap.archivedAt, undefined);
  assert.equal(record.bitmap.width, fixture.width); assert.equal(record.bitmap.height, fixture.height);
  const png = await readFile(`public${record.bitmap.asset}`); totalBytes += png.length;
  assert.deepEqual([...png.subarray(0,8)], [137,80,78,71,13,10,26,10]);
  const chunks = [];
  for (let offset = 8; offset < png.length;) {
    const size = png.readUInt32BE(offset), type = png.subarray(offset + 4, offset + 8).toString();
    chunks.push({ type, bytes: png.subarray(offset + 8, offset + 8 + size) }); offset += size + 12;
  }
  assert.deepEqual(chunks.map(chunk => chunk.type), ['IHDR','PLTE','IDAT','IEND'], 'No hidden text, original photograph or metadata payload.');
  const ihdr = chunks[0].bytes;
  assert.equal(ihdr.readUInt32BE(0), fixture.width); assert.equal(ihdr.readUInt32BE(4), fixture.height);
  assert.equal(ihdr[8], 8); assert.equal(ihdr[9], 3, 'Indexed native bitmap.');
  assert.deepEqual([...chunks[1].bytes], PALETTE.flat());
  const raw = inflateSync(chunks[2].bytes);
  assert.equal(raw.length, (fixture.width + 1) * fixture.height);
  for (let row = 0; row < fixture.height; row++) {
    assert.equal(raw[row * (fixture.width + 1)], 0);
    assert.deepEqual([...raw.subarray(row * (fixture.width + 1) + 1, (row + 1) * (fixture.width + 1))], [...fixture.bitmap.pixels.subarray(row * fixture.width, (row + 1) * fixture.width)]);
  }
  assert.ok(fixture.bitmap.pixels.every(value => value < 4));
  assert.ok(g.validBitmap(record.bitmap)); assert.deepEqual(record.evidence, []); assert.equal(record.reveals, undefined);
  assert.doesNotMatch(JSON.stringify(record), /Anna|AV-06|Site 6|MOTHER|author_only|writer_depth|story_role|cause_ref/i);
}
assert.deepEqual((await readdir('public/bitmaps')).sort(), fixtures.map(f => `${f.name}.png`).sort(), 'Only the three approved ordinary demo assets are public.');
const css = await readFile('src/app/features/documents/bitmap-viewer.css', 'utf8');
assert.match(css, /image-rendering: pixelated/); assert.match(css, /overflow: auto/);
assert.doesNotMatch(css, /(?:animation|transition|filter)\s*:/);
assert.match(await readFile('src/styles.css', 'utf8'), /\.crt \.document-content:not\(\.bitmap-content\)/);
if (process.argv.includes('--dist')) {
  const manifest = JSON.parse(await readFile('dist/client/ngsw.json', 'utf8'));
  for (const record of g.BITMAP_FILES) {
    assert.deepEqual(await readFile(`dist/client${record.bitmap.asset}`), await readFile(`public${record.bitmap.asset}`));
    assert.ok(manifest.hashTable[record.bitmap.asset]);
    assert.ok(manifest.assetGroups.some(group => group.installMode === 'prefetch' && group.urls.includes(record.bitmap.asset)), 'Ordinary demo bitmaps are included in the offline app shell.');
  }
  assert.ok(!(await readdir('dist/client', { recursive: true })).some(path => /\.pgm$|bitmap-fixtures\.mjs|docs[\\/]artwork/.test(path)), 'Original sources stay outside the public build.');
}
console.log(JSON.stringify({ fixtures: 3, paletteLevels: 4, publicImageBytes: totalBytes, nativeDimensions: fixtures.map(f => `${f.width}x${f.height}`), deterministicProcessing: 'passed', publicPackaging: process.argv.includes('--dist') ? 'passed' : 'not checked' }));
