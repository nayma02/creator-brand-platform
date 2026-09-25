import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve(process.argv.includes('--production') ? 'dist' : '.');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, `.${path === '/' ? '/index.html' : path}`);
    if (!file.startsWith(root + '/')) { res.writeHead(403); res.end(); return; }
    let data;
    try { data = await readFile(file); }
    catch (error) { if (!process.argv.includes('--production') && (path.startsWith('/assets/') || path.startsWith('/vendor/'))) data = await readFile(resolve(root, 'public', `.${path}`)); else throw error; }
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
const port = Number(process.env.PORT || 4173);
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`guapd running at http://localhost:${port}`));
