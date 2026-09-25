import { cp, mkdir, rm, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
for (const file of ['src/main.js', 'src/network.js']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status) throw new Error(result.stderr);
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
await cp('index.html', 'dist/index.html');
const html = await readFile('dist/index.html', 'utf8');
for (const path of [...html.matchAll(/(?:src|href)="(\/(?:src|assets|vendor)\/[^\"]+)"/g)].map(match => match[1])) await readFile(`dist${path}`);
console.log('Build complete: dist — JavaScript syntax and referenced assets verified.');
