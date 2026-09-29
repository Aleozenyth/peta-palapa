# Peta Palapa Ring (Web GIS)

Aplikasi Web GIS infrastruktur serat optik Palapa Ring (Barat, Tengah, Timur) dengan peta interaktif,
dashboard NOC/CRM, dan API Cloudflare Worker.

## Struktur

```
peta-palapa/
├── index.html                 # Peta GIS utama
├── dashboard.html             # Dashboard NOC & CRM
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── app.js             # Leaflet, filter layer, search
│       ├── dashboard.js       # Chart.js & tabel node
│       └── data-palapa.js     # GeoJSON (ES Module, satu sumber data)
├── cloudflare-worker/
│   ├── worker.js              # API /api/palapa-data
│   └── wrangler.toml
├── generate-zip.js
└── README.md
```

## Menjalankan secara lokal

Proyek memakai ES Module, sehingga **harus dibuka lewat server HTTP** (bukan `file://`):

```bash
npx serve .
# atau
python3 -m http.server 8080
```

Di VS Code, Anda juga bisa memakai ekstensi **Live Server** (klik kanan `index.html` → *Open with Live Server*).

## Menjalankan API (Cloudflare Worker)

```bash
cd cloudflare-worker
npx wrangler dev        # uji lokal
npx wrangler deploy     # deploy ke Cloudflare
```

Endpoint:

| Endpoint | Keterangan |
|---|---|
| `GET /api/palapa-data` | Kabel + node |
| `GET /api/palapa-data?layer=barat\|tengah\|timur\|node` | Satu layer saja |
| `GET /api/health` | Cek layanan |

Untuk memakai API dari frontend, isi konstanta `API_URL` di `assets/js/app.js`
(mis. `https://palapa-ring-api.akunanda.workers.dev`). Jika kosong, peta memakai data lokal.

## Membuat peta-palapa.zip

```bash
npm install jszip
node generate-zip.js
```

Hasilnya `peta-palapa.zip` di folder yang sama.

## Catatan data

- Titik node dan rantai kabel Paket Tengah mengikuti direktori NOC/Site yang sudah ada.
- Geometri kabel (terutama Barat dan Timur) bersifat **ilustrasi**. Ganti isi `CABLES` dan `NODES`
  di `data-palapa.js` dengan GeoJSON resmi (mis. hasil konversi KML/KMZ) untuk penggunaan operasional.
- Angka uptime, traffic, dan utilisasi di dashboard adalah **simulasi**.
