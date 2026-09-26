import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
for (const file of ['src/main.js', 'src/network.js', 'src/ending.js', 'src/demo.js', 'src/consent.js']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status) throw new Error(result.stderr);
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
await cp('index.html', 'dist/index.html');
// Inline every stylesheet, in document order, as one <style> block: no render-blocking CSS requests.
let html = await readFile('dist/index.html', 'utf8');
const sheets = [...html.matchAll(/^[ \t]*<link rel="stylesheet" href="(\/src\/[^"]+\.css)" \/>\n/gm)];
if (sheets.length) {
  const css = (await Promise.all(sheets.map(([, href]) => readFile(`.${href}`, 'utf8'))))
    .join('\n').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*\n/g, '\n').trim();
  html = html.replace(sheets[0][0], `  <style>${css}</style>\n`);
  for (const [line] of sheets.slice(1)) html = html.replace(line, '');
  await writeFile('dist/index.html', html);
}
for (const path of [...html.matchAll(/(?:src|href)="(\/(?:src|assets|vendor)\/[^\"]+)"/g)].map(match => match[1])) await readFile(`dist${path}`);
console.log(`Build complete: dist — JavaScript syntax and referenced assets verified; ${sheets.length} stylesheets inlined.`);
