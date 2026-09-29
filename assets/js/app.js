import { PALAPA_DATA } from './data-palapa.js';

/* Isi dengan URL Worker (mis. 'https://palapa-ring-api.akun.workers.dev') agar data diambil dari API.
   Kosong = pakai data lokal (data-palapa.js). */
const API_URL = 'https://palapa-ring-api.aleozenyth.workers.dev';

const PAKET = PALAPA_DATA.paket;

/* ---------- Utilitas ---------- */
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Number(n).toLocaleString('id-ID');

function haversine([lon1, lat1], [lon2, lat2]) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
const lineKm = (coords) => coords.slice(1).reduce((s, c, i) => s + haversine(coords[i], c), 0);

async function loadData() {
  if (!API_URL) return PALAPA_DATA;
  try {
    const r = await fetch(`${API_URL}/api/palapa-data`);
    if (!r.ok) throw new Error(r.status);
    return { ...(await r.json()), paket: PAKET };
  } catch (e) {
    console.warn('API gagal, memakai data lokal:', e);
    return PALAPA_DATA;
  }
}

/* ---------- Peta & basemap ---------- */
const map = L.map('map', { zoomControl: false }).setView([-2.548926, 118.014863], 5);
L.control.zoom({ position: 'topright' }).addTo(map);

const basemaps = {
  'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }),
  'Esri Light': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 16 }),
  'Esri Dark': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 16 })
};
basemaps['OpenStreetMap'].addTo(map);
L.control.layers(basemaps, null, { position: 'topright', collapsed: true }).addTo(map);

/* ---------- Panel detail ---------- */
const kv = (k, v) => `<div class="kv"><span>${esc(k)}</span><span>${v}</span></div>`;

function showDetail(html) {
  $('#detail').innerHTML = `<h2 class="panel-title">ℹ️ Detail</h2>${html}`;
  if (window.innerWidth < 768) $('#sidebar').classList.add('open');
}

function cableDetail(p, km) {
  const c = PAKET[p.paket];
  return `<h3 class="font-bold text-sm mb-2" style="color:${c.color}">${esc(p.nama)}</h3>
    ${kv('Paket', esc(c.label))}${kv('Jenis', esc(p.jenis))}${kv('Kapasitas', esc(p.kapasitas))}
    ${kv('Panjang (est.)', `${fmt(Math.round(km))} km`)}${kv('ID segmen', esc(p.id))}`;
}

function nodeDetail(p) {
  const c = PAKET[p.paket];
  const util = p.kapasitasGbps ? Math.round((p.terpakaiGbps / p.kapasitasGbps) * 100) : 0;
  return `<h3 class="font-bold text-sm mb-2" style="color:${c.color}">${esc(p.nama)}</h3>
    ${kv('Paket', esc(c.label))}${kv('Wilayah', esc(p.wilayah))}${kv('Tipe', esc(p.tipe))}
    ${kv('Kapasitas', `${fmt(p.kapasitasGbps)} Gbps`)}
    ${kv('Terpakai', `${fmt(p.terpakaiGbps)} Gbps (${util}%)`)}
    ${kv('Status', `<span class="badge ${esc(p.status)}">${esc(p.status)}</span>`)}
    <div class="mt-2 h-2 rounded bg-slate-800 overflow-hidden"><div class="h-full" style="width:${util}%;background:${c.color}"></div></div>`;
}

const nodePopup = (p) => `<h4>${esc(p.nama)}</h4>
  <div style="color:#94a3b8">${esc(p.wilayah)} · ${esc(p.tipe)}</div>
  <div style="margin-top:.35rem">${fmt(p.kapasitasGbps)} Gbps · <span class="badge ${esc(p.status)}">${esc(p.status)}</span></div>`;

/* ---------- Render layer ---------- */
const cableGroups = {};
const nodeMarkers = [];
let nodeGroup;

function render(data) {
  let totalKm = 0;

  Object.keys(PAKET).forEach((key) => {
    const feats = data.cables.features.filter((f) => f.properties.paket === key);
    const layer = L.geoJSON({ type: 'FeatureCollection', features: feats }, {
      style: (f) => ({
        color: PAKET[key].color, weight: 3.2, opacity: .9,
        dashArray: f.properties.jenis === 'Laut' ? '8 6' : null, lineCap: 'round'
      }),
      onEachFeature: (f, l) => {
        const km = lineKm(f.geometry.coordinates);
        totalKm += km;
        l.bindTooltip(`${esc(f.properties.nama)} · ${fmt(Math.round(km))} km`, { sticky: true });
        l.on('mouseover', () => l.setStyle({ weight: 6 }));
        l.on('mouseout', () => layer.resetStyle(l));
        l.on('click', (e) => { L.DomEvent.stopPropagation(e); showDetail(cableDetail(f.properties, km)); });
      }
    }).addTo(map);
    cableGroups[key] = layer;
    $(`#cnt-${key}`).textContent = `${feats.length} seg`;
  });

  nodeGroup = L.geoJSON(data.nodes, {
    pointToLayer: (f, latlng) => {
      const p = f.properties;
      const icon = L.divIcon({
        className: 'pulse-wrap', iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -10],
        html: `<div class="pulse-marker ${esc(p.status)}" style="--c:${PAKET[p.paket].color}"></div>`
      });
      return L.marker(latlng, { icon, title: p.nama, riseOnHover: true });
    },
    onEachFeature: (f, l) => {
      l.bindPopup(nodePopup(f.properties));
      l.on('click', () => showDetail(nodeDetail(f.properties)));
      nodeMarkers.push({ props: f.properties, marker: l });
    }
  }).addTo(map);

  $('#cnt-node').textContent = `${data.nodes.features.length}`;
  $('#stat-node').textContent = fmt(data.nodes.features.length);
  $('#stat-km').textContent = fmt(Math.round(totalKm));
}

/* ---------- Filter layer ---------- */
function bindFilters() {
  document.querySelectorAll('input[data-layer]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const key = cb.dataset.layer;
      const layer = key === 'node' ? nodeGroup : cableGroups[key];
      if (!layer) return;
      cb.checked ? map.addLayer(layer) : map.removeLayer(layer);
    });
  });
  $('#btn-reset').addEventListener('click', () => map.flyTo([-2.548926, 118.014863], 5, { duration: 1 }));
}

/* ---------- Search auto-suggest ---------- */
function bindSearch() {
  const input = $('#search'), list = $('#suggest');
  let items = [], idx = -1;

  const close = () => { list.classList.add('hidden'); idx = -1; };

  function pick(entry) {
    close();
    input.value = entry.props.nama;
    const nodeCb = document.querySelector('input[data-layer="node"]');
    if (!nodeCb.checked) { nodeCb.checked = true; map.addLayer(nodeGroup); }
    const ll = entry.marker.getLatLng();
    map.flyTo(ll, 9, { duration: 1.4 });
    map.once('moveend', () => entry.marker.openPopup());
    showDetail(nodeDetail(entry.props));
  }

  function draw(q) {
    const term = q.trim().toLowerCase();
    if (!term) return close();
    items = nodeMarkers.filter((n) => `${n.props.nama} ${n.props.wilayah}`.toLowerCase().includes(term)).slice(0, 8);
    list.innerHTML = items.length
      ? items.map((n, i) => `<li data-i="${i}">${esc(n.props.nama)}<small>${esc(n.props.wilayah)} · ${esc(PAKET[n.props.paket].label)}</small></li>`).join('')
      : '<li style="cursor:default;color:#94a3b8">Tidak ada hasil</li>';
    list.classList.remove('hidden');
    idx = -1;
  }

  input.addEventListener('input', () => draw(input.value));
  input.addEventListener('focus', () => draw(input.value));
  input.addEventListener('keydown', (e) => {
    const lis = [...list.querySelectorAll('li[data-i]')];
    if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, lis.length - 1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); e.preventDefault(); }
    else if (e.key === 'Enter') { if (items[Math.max(idx, 0)]) pick(items[Math.max(idx, 0)]); return; }
    else if (e.key === 'Escape') return close();
    lis.forEach((li, i) => li.classList.toggle('active', i === idx));
  });
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-i]');
    if (li) pick(items[+li.dataset.i]);
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('#search, #suggest')) close(); });
}

/* ---------- Sidebar mobile ---------- */
$('#btn-toggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
map.on('click', () => { if (window.innerWidth < 768) $('#sidebar').classList.remove('open'); });

/* ---------- Start ---------- */
loadData().then((data) => {
  render(data);
  bindFilters();
  bindSearch();
});