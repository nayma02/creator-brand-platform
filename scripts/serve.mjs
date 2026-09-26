import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
const production = process.argv.includes('--production');
const root = resolve(production ? 'dist' : '.');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const compressible = new Set(['.html', '.css', '.js', '.svg', '.ttf']);
// Production mirrors the host: compressed text, long-lived hashed-by-path assets, revalidated HTML (keeps the back/forward cache usable).
function cacheControl(ext) {
  if (!production) return 'no-store';
  return ext === '.html' ? 'public, max-age=0, must-revalidate' : 'public, max-age=86400, must-revalidate';
}
const server = http.createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, `.${path === '/' ? '/index.html' : path}`);
    if (!file.startsWith(root + '/')) { res.writeHead(403); res.end(); return; }
    let data;
    try { data = await readFile(file); }
    catch (error) { if (!production && (path.startsWith('/assets/') || path.startsWith('/vendor/'))) data = await readFile(resolve(root, 'public', `.${path}`)); else throw error; }
    const ext = extname(file);
    const headers = { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': cacheControl(ext), 'Vary': 'Accept-Encoding' };
    const accepts = req.headers['accept-encoding'] || '';
    if (compressible.has(ext)) {
      if (/\bbr\b/.test(accepts)) { data = brotliCompressSync(data, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }); headers['Content-Encoding'] = 'br'; }
      else if (/\bgzip\b/.test(accepts)) { data = gzipSync(data, { level: 9 }); headers['Content-Encoding'] = 'gzip'; }
    }
    res.writeHead(200, headers);
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
const port = Number(process.env.PORT || 4173);
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`guapd running at http://localhost:${port}`));
