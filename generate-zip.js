/**
 * Memaketkan seluruh proyek menjadi peta-palapa.zip
 * Jalankan:  npm install jszip   lalu   node generate-zip.js
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, 'peta-palapa.zip');
const FILES = [
  'index.html',
  'dashboard.html',
  'assets/css/style.css',
  'assets/js/app.js',
  'assets/js/dashboard.js',
  'assets/js/data-palapa.js',
  'assets/js/api.js',
  'assets/js/config.js',
  'netlify/functions/palapa-api.mjs',
  'netlify.toml',
  'package.json',
  '.gitignore',
  'cloudflare-worker/worker.js',
  'cloudflare-worker/wrangler.toml',
  'README.md',
  'generate-zip.js'
];

async function main() {
  const zip = new JSZip();
  const root = zip.folder('peta-palapa');
  const missing = [];

  for (const rel of FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { missing.push(rel); continue; }
    root.file(rel, fs.readFileSync(abs));
    console.log('  + ' + rel);
  }

  if (missing.length) {
    console.error('\n✖ File berikut tidak ditemukan:\n  - ' + missing.join('\n  - '));
    process.exit(1);
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`\n✔ Selesai: ${OUTPUT} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
