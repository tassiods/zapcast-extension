import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const required = ['manifest_version', 'name', 'version', 'action', 'background', 'content_scripts'];
const missing = required.filter((key) => manifest[key] === undefined);
if (missing.length) throw new Error(`Missing manifest keys: ${missing.join(', ')}`);
if (manifest.manifest_version !== 3) throw new Error('Only Manifest V3 is supported.');
console.log('manifest ok');
