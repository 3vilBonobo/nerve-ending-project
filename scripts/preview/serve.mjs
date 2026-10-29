import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const directoryArg = process.argv.indexOf('--dir');
const root = resolve(directoryArg >= 0 ? process.argv[directoryArg + 1] : 'dist/client');
const index = await readFile(resolve(root, 'index.html'), 'utf8');
const base = index.match(/<base href="([^"]+)"/)?.[1] ?? '/';
if (!base.startsWith('/') || !base.endsWith('/') || base.startsWith('//')) throw new Error('Preview requires a local absolute base href with a trailing slash.');
const portArg = process.argv.indexOf('--port');
const port = portArg >= 0 ? Number(process.argv[portArg + 1]) : 4173;
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Use --port followed by a local port between 1024 and 65535.');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.mjs': 'application/javascript', '.wasm': 'application/wasm', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (base !== '/' && pathname === base.slice(0, -1)) { response.writeHead(301, { Location: base }); response.end(); return; }
    if (!pathname.startsWith(base)) { response.writeHead(404); response.end('Not found'); return; }
    let file = resolve(root, '.' + '/' + pathname.slice(base.length));
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    try { if (!(await stat(file)).isFile()) file = resolve(root, 'index.html'); }
    catch { if (extname(pathname)) { response.writeHead(404); response.end('Not found'); return; } file = resolve(root, 'index.html'); }
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(body);
  } catch { response.writeHead(500); response.end('Build the application first with npm run build.'); }
}).listen(port, '127.0.0.1', () => console.log(`Nerve Ending production preview: http://127.0.0.1:${port}${base}`));
