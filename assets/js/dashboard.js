import { PALAPA_DATA } from './data-palapa.js';

const { cables, nodes, paket: PAKET } = PALAPA_DATA;
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n, d = 0) => Number(n).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });

function haversine([lon1, lat1], [lon2, lat2]) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
const lineKm = (c) => c.slice(1).reduce((s, p, i) => s + haversine(c[i], p), 0);

/* ---------- Data turunan ---------- */
const rows = nodes.features.map((f) => ({
  ...f.properties,
  util: f.properties.kapasitasGbps ? Math.round((f.properties.terpakaiGbps / f.properties.kapasitasGbps) * 100) : 0
}));

/* ---------- Metric cards ---------- */
function renderMetrics() {
  const totalKm = cables.features.reduce((s, f) => s + lineKm(f.geometry.coordinates), 0);
  const cap = rows.reduce((s, r) => s + r.kapasitasGbps, 0);
  const used = rows.reduce((s, r) => s + r.terpakaiGbps, 0);
  const online = rows.filter((r) => r.status === 'Online').length;
  const degr = rows.filter((r) => r.status === 'Degradation').length;
  const mnt = rows.filter((r) => r.status === 'Maintenance').length;
  // Uptime simulasi: Online=100%, Degradation=99,5%, Maintenance=98%
  const uptime = rows.reduce((s, r) => s + (r.status === 'Online' ? 100 : r.status === 'Degradation' ? 99.5 : 98), 0) / rows.length;

  $('#m-node').textContent = fmt(rows.length);
  $('#m-node-sub').textContent = `${online} online · ${degr} degradasi · ${mnt} maintenance`;
  $('#m-km').textContent = `${fmt(Math.round(totalKm))} km`;
  $('#m-uptime').textContent = `${fmt(uptime, 2)}%`;
  $('#m-bw').textContent = `${fmt(used)} Gbps`;
  $('#m-bw-sub').textContent = `dari ${fmt(cap)} Gbps (${Math.round((used / cap) * 100)}%)`;
  return used;
}

/* ---------- Chart ---------- */
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(148,163,184,.12)';

function renderTraffic(baseUsed) {
  const N = 30;
  const labels = Array.from({ length: N }, () => '');
  const shares = { barat: 0.28, tengah: 0.46, timur: 0.26 };
  const mk = (k) => Array.from({ length: N }, () => +(baseUsed * shares[k] * (0.9 + Math.random() * 0.2)).toFixed(1));
  const keys = Object.keys(PAKET);
  const datasets = keys.map((k) => ({
    label: PAKET[k].label, data: mk(k), borderColor: PAKET[k].color,
    backgroundColor: PAKET[k].color + '22', fill: true, tension: .35, pointRadius: 0, borderWidth: 2
  }));

  const chart = new Chart($('#chart-traffic'), {
    type: 'line', data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      scales: { y: { beginAtZero: true, title: { display: true, text: 'Gbps' } }, x: { ticks: { display: false } } },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
    }
  });

  setInterval(() => {
    datasets.forEach((ds, i) => {
      ds.data.push(+(baseUsed * shares[keys[i]] * (0.9 + Math.random() * 0.2)).toFixed(1));
      ds.data.shift();
    });
    chart.update('none');
  }, 2000);
}

function renderHealth() {
  const keys = Object.keys(PAKET);
  const count = (st) => keys.map((k) => rows.filter((r) => r.paket === k && r.status === st).length);
  new Chart($('#chart-health'), {
    type: 'bar',
    data: {
      labels: keys.map((k) => PAKET[k].label.replace('Palapa Ring ', '')),
      datasets: [
        { label: 'Online', data: count('Online'), backgroundColor: '#34d399' },
        { label: 'Degradation', data: count('Degradation'), backgroundColor: '#fbbf24' },
        { label: 'Maintenance', data: count('Maintenance'), backgroundColor: '#f87171' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Jumlah node' } } },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
    }
  });
}

/* ---------- Tabel interaktif ---------- */
const state = { q: '', status: 'all', key: 'nama', dir: 1 };

function renderTable() {
  const q = state.q.trim().toLowerCase();
  const list = rows
    .filter((r) => (state.status === 'all' || r.status === state.status) &&
      (!q || `${r.nama} ${r.wilayah} ${r.tipe}`.toLowerCase().includes(q)))
    .sort((a, b) => {
      const x = a[state.key], y = b[state.key];
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'id')) * state.dir;
    });

  $('#tbl-body').innerHTML = list.length
    ? list.map((r) => `<tr>
        <td class="font-semibold">${esc(r.nama)}</td>
        <td><span style="color:${PAKET[r.paket].color}">●</span> ${esc(PAKET[r.paket].label.replace('Palapa Ring ', ''))}</td>
        <td class="text-slate-400">${esc(r.wilayah)}</td>
        <td class="text-slate-400">${esc(r.tipe)}</td>
        <td class="text-right font-mono">${fmt(r.kapasitasGbps)} G</td>
        <td class="text-right font-mono">${r.util}%</td>
        <td><span class="badge ${esc(r.status)}">${esc(r.status)}</span></td>
      </tr>`).join('')
    : '<tr><td colspan="7" class="text-center text-slate-500 py-8">Tidak ada node yang cocok dengan filter.</td></tr>';
  $('#tbl-info').textContent = `Menampilkan ${list.length} dari ${rows.length} node`;
}

$('#tbl-search').addEventListener('input', (e) => { state.q = e.target.value; renderTable(); });
$('#tbl-filter').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-s]');
  if (!b) return;
  state.status = b.dataset.s;
  document.querySelectorAll('#tbl-filter .chip').forEach((c) => c.classList.toggle('active', c === b));
  renderTable();
});
document.querySelectorAll('.th').forEach((th) => th.addEventListener('click', () => {
  const k = th.dataset.k;
  state.dir = state.key === k ? -state.dir : 1;
  state.key = k;
  renderTable();
}));

/* ---------- Start ---------- */
const used = renderMetrics();
renderTraffic(used);
renderHealth();
renderTable();
