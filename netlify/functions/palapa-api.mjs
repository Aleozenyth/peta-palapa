/**
 * Netlify Function (v2) — API Palapa Ring.
 * Diakses langsung lewat path (tanpa redirect) berkat `config.path` di bawah.
 *
 *   GET /api/palapa-data              -> { cables, nodes }
 *   GET /api/palapa-data?layer=barat  -> kabel paket (barat|tengah|timur)
 *   GET /api/palapa-data?layer=node   -> node
 *   GET /api/health                   -> status layanan
 */
import { CABLES, NODES } from '../../assets/js/data-palapa.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS, ...extra }
  });

export default async (request) => {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET') return json({ error: 'Metode tidak diizinkan' }, 405);

  if (url.pathname === '/api/health') {
    return json({ status: 'ok', platform: 'netlify', waktu: new Date().toISOString() }, 200, { 'Cache-Control': 'no-store' });
  }

  if (url.pathname === '/api/palapa-data') {
    const layer = url.searchParams.get('layer');
    const cache = { 'Cache-Control': 'public, max-age=300' };

    if (!layer) return json({ cables: CABLES, nodes: NODES }, 200, cache);
    if (layer === 'node') return json(NODES, 200, cache);
    if (['barat', 'tengah', 'timur'].includes(layer)) {
      return json({
        type: 'FeatureCollection',
        features: CABLES.features.filter((f) => f.properties.paket === layer)
      }, 200, cache);
    }
    return json({ error: `Layer '${layer}' tidak dikenal. Gunakan barat, tengah, timur, atau node.` }, 400);
  }

  return json({ error: 'Endpoint tidak ditemukan', endpoints: ['/api/palapa-data', '/api/health'] }, 404);
};

export const config = { path: ['/api/palapa-data', '/api/health'] };
