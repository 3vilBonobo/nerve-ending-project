import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

// Original code-drawn terminal icon; no external assets or font dependencies.
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type), length = Buffer.alloc(4), checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length); checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}
function icon(size) {
  const bytes = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size * 128, v = y / size * 128;
    const monitor = ((u >= 27 && u <= 101 && (Math.abs(v - 30) < 2 || Math.abs(v - 85) < 2)) || (v >= 30 && v <= 85 && (Math.abs(u - 27) < 2 || Math.abs(u - 101) < 2)));
    const stand = (Math.abs(u - 64) < 2 && v > 85 && v < 101) || (u > 46 && u < 82 && Math.abs(v - 101) < 2);
    const prompt = u > 40 && u < 54 && Math.abs(Math.abs(v - 56) - (54 - u)) < 2;
    const cursor = u > 65 && u < 84 && Math.abs(v - 68) < 2;
    const index = y * (size * 4 + 1) + x * 4 + 1;
    const color = monitor || stand || prompt || cursor ? [166, 232, 177, 255] : [3, 10, 6, 255];
    bytes.set(color, index);
  }
  const header = Buffer.alloc(13); header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(bytes)), chunk('IEND', Buffer.alloc(0))]);
}
for (const size of [192, 512]) writeFileSync(`public/icons/icon-${size}.png`, icon(size));
