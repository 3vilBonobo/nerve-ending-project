import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

// Original procedural artwork, kept outside public/. No photos, randomness or runtime processing.
export const PALETTE = [[5, 11, 5], [45, 65, 34], [104, 137, 78], [164, 204, 124]];
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export function processBitmap(source, width, height, dither = false) {
  if (!Number.isInteger(source.width) || !Number.isInteger(source.height) || source.width < 1 || source.height < 1 || source.rgb.length !== source.width * source.height * 3
    || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new Error('Invalid bitmap dimensions or RGB source.');
  const pixels = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const offset = (Math.floor(y * source.height / height) * source.width + Math.floor(x * source.width / width)) * 3;
    const luminance = (77 * source.rgb[offset] + 150 * source.rgb[offset + 1] + 29 * source.rgb[offset + 2] + 128) >> 8;
    const threshold = dither ? (BAYER4[(Math.floor(y / 2) % 4) * 4 + Math.floor(x / 2) % 4] + .5) / 16 - .5 : 0;
    pixels[y * width + x] = Math.max(0, Math.min(3, Math.round(luminance * 3 / 255 + threshold)));
  }
  return { width, height, pixels };
}
const crc32 = bytes => {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
};
const chunk = (name, body) => {
  const data = Buffer.concat([Buffer.from(name), body]); const size = Buffer.alloc(4); const crc = Buffer.alloc(4);
  size.writeUInt32BE(body.length); crc.writeUInt32BE(crc32(data)); return Buffer.concat([size, data, crc]);
};
export function encodePng(bitmap) {
  const header = Buffer.alloc(13); header.writeUInt32BE(bitmap.width); header.writeUInt32BE(bitmap.height, 4); header[8] = 8; header[9] = 3;
  const rows = Buffer.alloc((bitmap.width + 1) * bitmap.height);
  for (let y = 0; y < bitmap.height; y++) rows.set(bitmap.pixels.subarray(y * bitmap.width, (y + 1) * bitmap.width), y * (bitmap.width + 1) + 1);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('PLTE', Buffer.from(PALETTE.flat())), chunk('IDAT', deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
function drawing(width, height, background) {
  const gray = new Uint8Array(width * height).fill(background);
  const dot = (x, y, tone) => { if (x >= 0 && x < width && y >= 0 && y < height) gray[Math.floor(y) * width + Math.floor(x)] = tone; };
  const rect = (x, y, w, h, tone) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) dot(i, j, tone); };
  const line = (x0, y0, x1, y1, tone) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= steps; i++) dot(Math.round(x0 + (x1 - x0) * i / Math.max(1, steps)), Math.round(y0 + (y1 - y0) * i / Math.max(1, steps)), tone);
  };
  const polygon = (points, tone) => {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i], [xj, yj] = points[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) dot(x, y, tone);
    }
  };
  const ellipse = (cx, cy, rx, ry, tone) => { for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) dot(x, y, tone); };
  return { width, height, gray, dot, rect, line, polygon, ellipse, rgb: () => Uint8Array.from(Array.from(gray).flatMap(value => [value, value, value])) };
}
const FONT = {
  A: ['01110','10001','10001','11111','10001','10001','10001'], B: ['11110','10001','10001','11110','10001','10001','11110'],
  D: ['11110','10001','10001','10001','10001','10001','11110'], E: ['11111','10000','10000','11110','10000','10000','11111'],
  I: ['11111','00100','00100','00100','00100','00100','11111'], L: ['10000','10000','10000','10000','10000','10000','11111'],
  M: ['10001','11011','10101','10101','10001','10001','10001'], N: ['10001','11001','11001','10101','10011','10011','10001'],
  O: ['01110','10001','10001','10001','10001','10001','01110'], P: ['11110','10001','10001','11110','10000','10000','10000'],
  Q: ['01110','10001','10001','10001','10101','10010','01101'], R: ['11110','10001','10001','11110','10100','10010','10001'],
  S: ['01111','10000','10000','01110','00001','00001','11110'], T: ['11111','00100','00100','00100','00100','00100','00100'],
  U: ['10001','10001','10001','10001','10001','10001','01110'], Y: ['10001','10001','01010','00100','00100','00100','00100'],
};
function label(d, text, x, y) {
  [...text].forEach((letter, index) => {
    if (letter === ' ') return;
    if (!FONT[letter]) throw new Error(`Missing fixture glyph ${letter}`);
    FONT[letter].forEach((row, j) => [...row].forEach((pixel, i) => { if (pixel === '1') d.dot(x + index * 6 + i, y + j, 255); }));
  });
}
function portrait() {
  const d = drawing(32, 32, 40); d.rect(3, 2, 26, 28, 64);
  d.polygon([[6,32],[8,25],[13,22],[20,22],[25,26],[27,32]], 88); d.rect(14, 18, 5, 6, 134);
  d.ellipse(16, 12, 6, 8, 166); d.rect(9, 11, 2, 4, 132); d.rect(22, 11, 1, 4, 132);
  d.polygon([[10,13],[9,8],[12,4],[19,4],[23,8],[22,13],[19,8],[14,7],[12,10]], 35);
  d.rect(12,11,2,1,35); d.rect(18,11,2,1,35); d.rect(16,12,1,3,112); d.rect(14,16,4,1,74);
  d.polygon([[12,23],[16,26],[13,28],[10,24]], 206); d.polygon([[20,23],[16,26],[19,28],[23,25]], 206);
  return d;
}
function room() {
  const d = drawing(40, 30, 50);
  d.polygon([[0,0],[40,0],[33,5],[8,5]], 100); d.rect(8,5,25,19,88);
  d.polygon([[0,30],[8,23],[33,23],[40,30]], 66); d.line(8,5,8,23,120); d.line(33,5,33,23,120);
  d.rect(15,3,11,1,190); d.rect(10,8,8,15,132); d.rect(11,10,6,4,30); d.rect(11,16,6,5,54); d.dot(16,15,220);
  d.rect(23,9,7,14,112); d.rect(24,11,5,4,30); d.rect(24,17,5,4,54); d.dot(27,16,210);
  d.line(8,23,0,29,100); d.line(16,23,12,29,100); d.line(25,23,29,29,100); d.line(33,23,39,29,100); d.line(4,26,36,26,100);
  return d;
}
function diagram() {
  const d = drawing(160, 120, 5);
  d.line(5,5,154,5,100); d.line(5,114,154,114,100); d.line(5,5,5,114,100); d.line(154,5,154,114,100);
  label(d, 'EQUIPMENT', 11, 14); label(d, 'DEMO', 122, 14);
  for (const [x, w, word] of [[9,36,'INPUT'], [61,32,'UNIT'], [108,45,'DISPLAY']]) {
    d.line(x,45,x+w,45,220); d.line(x,74,x+w,74,220); d.line(x,45,x,74,220); d.line(x+w,45,x+w,74,220);
    label(d, word, x + Math.floor((w - (word.length * 6 - 1)) / 2), 57);
  }
  for (const [start, end] of [[46,60],[94,107]]) { d.line(start,60,end,60,220); d.line(end-3,57,end,60,220); d.line(end-3,63,end,60,220); }
  label(d, 'DEMONSTRATION ONLY', 17, 94);
  return d;
}
export function fixtureAssets() {
  return [
    { name: 'demo-employee-id', source: portrait(), width: 128, height: 128, dither: true },
    { name: 'demo-equipment-layout', source: diagram(), width: 160, height: 120, dither: false },
    { name: 'demo-equipment-room', source: room(), width: 160, height: 120, dither: true },
  ].map(fixture => ({ ...fixture, bitmap: processBitmap({ width: fixture.source.width, height: fixture.source.height, rgb: fixture.source.rgb() }, fixture.width, fixture.height, fixture.dither) }));
}
async function main() {
  const checking = process.argv.includes('--check');
  for (const fixture of fixtureAssets()) {
    const pgm = `P2\n# Original deterministic demonstration source; no fictional identity or location\n${fixture.source.width} ${fixture.source.height}\n255\n` + Array.from({ length: fixture.source.height }, (_, y) => Array.from(fixture.source.gray.subarray(y * fixture.source.width, (y + 1) * fixture.source.width)).join(' ')).join('\n') + '\n';
    for (const [path, bytes] of [[`public/bitmaps/${fixture.name}.png`, encodePng(fixture.bitmap)], [`docs/artwork/implementation-03/${fixture.name}.pgm`, Buffer.from(pgm)]]) {
      if (checking) { if (!(await readFile(path)).equals(bytes)) throw new Error(`Bitmap fixture differs: ${path}`); }
      else { await mkdir(dirname(path), { recursive: true }); await writeFile(path, bytes); }
    }
  }
  console.log(JSON.stringify({ fixtures: 3, paletteLevels: PALETTE.length, mode: checking ? 'verified' : 'generated' }));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
