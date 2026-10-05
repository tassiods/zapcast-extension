import fs from 'node:fs';
import path from 'node:path';
const dist = 'dist/zapcast-extension';
fs.rmSync('dist', { recursive: true, force: true });
for (const file of ['manifest.json', 'popup.html', 'options.html']) {
  fs.mkdirSync(path.join(dist, path.dirname(file)), { recursive: true });
  fs.copyFileSync(file, path.join(dist, file));
}
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}
copyDir('src', path.join(dist, 'src'));
console.log(`packed ${dist}`);
