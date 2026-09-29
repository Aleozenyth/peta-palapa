/**
 * Konfigurasi koneksi API.
 *
 * API_BASE:
 *   ''                                   -> API di domain yang sama (Netlify Functions: /api/palapa-data)
 *   'https://palapa-ring-api.xxx.workers.dev' -> API di Cloudflare Worker (domain berbeda)
 *
 * USE_API: false = paksa memakai data lokal (data-palapa.js), tanpa memanggil API.
 * Jika API gagal/tidak tersedia (mis. saat dibuka dengan `npx serve`), aplikasi otomatis
 * memakai data lokal sebagai cadangan.
 */
export const CONFIG = {
  USE_API: true,
  API_BASE: '',
  TIMEOUT_MS: 6000
};
