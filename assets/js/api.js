import { PALAPA_DATA } from './data-palapa.js';
import { CONFIG } from './config.js';

/** Ambil data dari API; jika gagal, kembali ke data lokal. Hasil selalu menyertakan `source`. */
export async function loadData() {
  const lokal = { ...PALAPA_DATA, source: 'lokal' };
  if (CONFIG.USE_API === false) return lokal;

  const base = String(CONFIG.API_BASE || '').replace(/\/+$/, '');
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), CONFIG.TIMEOUT_MS || 6000);

  try {
    const res = await fetch(`${base}/api/palapa-data`, { signal: ctl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json();
    if (!d?.cables?.features || !d?.nodes?.features) throw new Error('Format respons tidak valid');
    return { cables: d.cables, nodes: d.nodes, paket: PALAPA_DATA.paket, source: 'api' };
  } catch (e) {
    console.warn('[Palapa] API tidak tersedia, memakai data lokal:', e.message || e);
    return lokal;
  } finally {
    clearTimeout(timer);
  }
}

/** Tampilkan lencana sumber data pada elemen tertentu. */
export function showSource(el, source) {
  if (!el) return;
  const api = source === 'api';
  el.textContent = api ? '🟢 Data dari API' : '🟡 Data lokal (API tidak terhubung)';
  el.style.cssText = `display:inline-block;font-size:.68rem;font-weight:700;padding:.2rem .6rem;border-radius:999px;` +
    `background:${api ? 'rgba(52,211,153,.15)' : 'rgba(251,191,36,.15)'};color:${api ? '#34d399' : '#fbbf24'};` +
    `border:1px solid ${api ? 'rgba(52,211,153,.4)' : 'rgba(251,191,36,.4)'}`;
}
