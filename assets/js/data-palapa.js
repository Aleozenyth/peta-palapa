/**
 * Data GeoJSON Palapa Ring (ES Module) — satu sumber untuk peta, dashboard, dan Worker.
 * Koordinat berformat [longitude, latitude].
 * CATATAN: geometri kabel bersifat ILUSTRATIF (pendekatan), bukan trase survei.
 */

const line = (id, paket, nama, jenis, kapasitas, coordinates) => ({
  type: 'Feature',
  id,
  properties: { id, paket, nama, jenis, kapasitas },
  geometry: { type: 'LineString', coordinates }
});

const node = (id, paket, nama, wilayah, tipe, kapasitasGbps, terpakaiGbps, status, lon, lat) => ({
  type: 'Feature',
  id,
  properties: { id, paket, nama, wilayah, tipe, kapasitasGbps, terpakaiGbps, status, aktif: status !== 'Maintenance' },
  geometry: { type: 'Point', coordinates: [lon, lat] }
});

/* ============ KABEL ============ */
export const CABLES = {
  type: 'FeatureCollection',
  features: [
    /* ---- BARAT (merah) ---- */
    line('B-01', 'barat', 'Dumai – Batam', 'Laut', '100 Gbps',
      [[101.45, 1.67], [102.5, 1.5], [103.5, 1.25], [104.05, 1.13]]),
    line('B-02', 'barat', 'Pekanbaru – Dumai', 'Darat', '100 Gbps',
      [[101.45, 0.51], [101.42, 1.1], [101.45, 1.67]]),
    line('B-03', 'barat', 'Batam – Tanjung Pinang', 'Laut', '100 Gbps',
      [[104.05, 1.13], [104.3, 1.0], [104.45, 0.92]]),
    line('B-04', 'barat', 'Batam – Tarempa (Anambas)', 'Laut', '100 Gbps',
      [[104.05, 1.13], [105.0, 2.0], [106.22, 3.22]]),
    line('B-05', 'barat', 'Tarempa – Ranai (Natuna)', 'Laut', '100 Gbps',
      [[106.22, 3.22], [107.3, 3.6], [108.38, 3.95]]),
    line('B-06', 'barat', 'Batam – Singkawang', 'Laut', '100 Gbps',
      [[104.05, 1.13], [106.0, 0.95], [108.0, 0.9], [108.98, 0.91]]),
    line('B-07', 'barat', 'Singkawang – Pontianak', 'Darat', '100 Gbps',
      [[108.98, 0.91], [109.2, 0.5], [109.33, -0.03]]),

    /* ---- TENGAH (hijau) — mengikuti rantai node P4–P8B ---- */
    line('T-01', 'tengah', 'P4 · Sendawar – Long Bagun', 'Darat', '100 Gbps',
      [[115.666, -0.233], [115.5, 0.05], [115.35, 0.3], [115.242, 0.514]]),
    line('T-02', 'tengah', 'P5 · Kendari – Wanggudu', 'Darat', '100 Gbps',
      [[122.497, -3.965], [122.3, -3.75], [122.116, -3.513]]),
    line('T-03', 'tengah', 'P5 · Wanggudu – Bungku – Petasia – Tentena', 'Darat', '100 Gbps',
      [[122.116, -3.513], [121.965, -2.537], [121.34, -1.972], [120.659, -1.744]]),
    line('T-04', 'tengah', 'P6 · Kendari – Wawonii – Raha', 'Laut', '100 Gbps',
      [[122.497, -3.965], [122.988, -4.05], [122.716, -4.834]]),
    line('T-05', 'tengah', 'P6 · Raha – Buranga – Baubau – Lakudo', 'Laut', '100 Gbps',
      [[122.716, -4.834], [122.984, -4.801], [122.561, -5.501], [122.531, -5.294]]),
    line('T-06', 'tengah', 'P6 · Lakudo – Sawerigadi – Raha', 'Laut', '100 Gbps',
      [[122.531, -5.294], [122.433, -4.791], [122.716, -4.834]]),
    line('T-07', 'tengah', 'P7 · Luwuk – Salakan – Banggai – Taliabu – Sanana', 'Laut', '100 Gbps',
      [[122.791, -0.994], [123.307, -1.308], [123.513, -1.595], [124.388, -1.95], [125.977, -2.077]]),
    line('T-08', 'tengah', 'P8A · Manado – Ondong Siau – Tahuna – Melonguane', 'Laut', '100 Gbps',
      [[124.822, 1.446], [125.361, 2.739], [125.456, 3.616], [126.695, 4.003]]),
    line('T-09', 'tengah', 'P8A · Melonguane – Morotai Selatan – Tobelo', 'Laut', '100 Gbps',
      [[126.695, 4.003], [128.312, 2.062], [128.009, 1.733]]),
    line('T-10', 'tengah', 'P8B · Ternate – Tidore – Sofifi', 'Laut', '100 Gbps',
      [[127.386, 0.832], [127.453, 0.694], [127.569, 0.739]]),

    /* ---- TIMUR (biru) ---- */
    line('E-01', 'timur', 'Labuan Bajo – Maumere', 'Laut', '100 Gbps',
      [[119.88, -8.5], [121.0, -8.55], [122.21, -8.62]]),
    line('E-02', 'timur', 'Maumere – Kupang', 'Laut', '100 Gbps',
      [[122.21, -8.62], [122.9, -9.5], [123.6, -10.17]]),
    line('E-03', 'timur', 'Kupang – Saumlaki', 'Laut', '100 Gbps',
      [[123.6, -10.17], [126.0, -9.6], [131.3, -7.98]]),
    line('E-04', 'timur', 'Saumlaki – Ambon', 'Laut', '100 Gbps',
      [[131.3, -7.98], [130.0, -5.8], [128.18, -3.7]]),
    line('E-05', 'timur', 'Ambon – Sorong', 'Laut', '100 Gbps',
      [[128.18, -3.7], [129.8, -2.2], [131.26, -0.88]]),
    line('E-06', 'timur', 'Sorong – Manokwari – Biak', 'Laut', '100 Gbps',
      [[131.26, -0.88], [134.06, -0.86], [136.08, -1.18]]),
    line('E-07', 'timur', 'Biak – Jayapura', 'Laut', '100 Gbps',
      [[136.08, -1.18], [138.5, -1.8], [140.72, -2.53]]),
    line('E-08', 'timur', 'Sorong – Fakfak – Kaimana', 'Laut', '100 Gbps',
      [[131.26, -0.88], [132.3, -2.93], [133.75, -3.65]]),
    line('E-09', 'timur', 'Kaimana – Timika – Merauke', 'Laut', '100 Gbps',
      [[133.75, -3.65], [136.9, -4.55], [140.4, -8.5]]),
    line('E-10', 'timur', 'Jayapura – Merauke (darat)', 'Darat', '100 Gbps',
      [[140.72, -2.53], [140.6, -5.0], [140.4, -8.5]])
  ]
};

/* ============ NODE POP / LANDING STATION ============ */
export const NODES = {
  type: 'FeatureCollection',
  features: [
    /* Barat */
    node('N-B01', 'barat', 'Pekanbaru', 'Riau', 'POP', 200, 88, 'Online', 101.45, 0.51),
    node('N-B02', 'barat', 'Dumai', 'Riau', 'Landing Station', 200, 74, 'Online', 101.45, 1.67),
    node('N-B03', 'barat', 'Batam', 'Kepulauan Riau', 'POP', 400, 236, 'Online', 104.05, 1.13),
    node('N-B04', 'barat', 'Tanjung Pinang', 'Kepulauan Riau', 'POP', 100, 41, 'Online', 104.45, 0.92),
    node('N-B05', 'barat', 'Tarempa (Anambas)', 'Kepulauan Riau', 'Landing Station', 100, 27, 'Degradation', 106.22, 3.22),
    node('N-B06', 'barat', 'Ranai (Natuna)', 'Kepulauan Riau', 'Landing Station', 100, 33, 'Online', 108.38, 3.95),
    node('N-B07', 'barat', 'Singkawang', 'Kalimantan Barat', 'Landing Station', 100, 39, 'Online', 108.98, 0.91),
    node('N-B08', 'barat', 'Pontianak', 'Kalimantan Barat', 'POP', 200, 96, 'Online', 109.33, -0.03),

    /* Tengah — koordinat dari direktori NOC/Site */
    node('N-T01', 'tengah', 'Sendawar', 'Kalimantan Timur', 'POP', 100, 46, 'Online', 115.666194, -0.232528),
    node('N-T02', 'tengah', 'Long Bagun', 'Kalimantan Timur', 'Titik Layanan', 100, 18, 'Online', 115.241639, 0.514222),
    node('N-T03', 'tengah', 'Kendari', 'Sulawesi Tenggara', 'POP', 400, 212, 'Online', 122.496639, -3.965028),
    node('N-T04', 'tengah', 'Wanggudu', 'Sulawesi Tenggara', 'Titik Layanan', 100, 34, 'Online', 122.115833, -3.512778),
    node('N-T05', 'tengah', 'Bungku', 'Sulawesi Tengah', 'Titik Layanan', 100, 29, 'Online', 121.965361, -2.537278),
    node('N-T06', 'tengah', 'Petasia', 'Sulawesi Tengah', 'Titik Layanan', 100, 22, 'Degradation', 121.339928, -1.972264),
    node('N-T07', 'tengah', 'Tentena', 'Sulawesi Tengah', 'POP', 100, 31, 'Online', 120.659, -1.744089),
    node('N-T08', 'tengah', 'Wawonii', 'Sulawesi Tenggara', 'Titik Layanan', 100, 15, 'Online', 122.988281, -4.049623),
    node('N-T09', 'tengah', 'Raha', 'Sulawesi Tenggara', 'Titik Layanan', 100, 37, 'Online', 122.716167, -4.834011),
    node('N-T10', 'tengah', 'Baubau', 'Sulawesi Tenggara', 'POP', 200, 92, 'Online', 122.561449, -5.501422),
    node('N-T11', 'tengah', 'Luwuk', 'Sulawesi Tengah', 'POP', 200, 78, 'Online', 122.790969, -0.994419),
    node('N-T12', 'tengah', 'Salakan', 'Sulawesi Tengah', 'Titik Layanan', 100, 19, 'Online', 123.307401, -1.307817),
    node('N-T13', 'tengah', 'Taliabu', 'Maluku Utara', 'Titik Layanan', 100, 12, 'Maintenance', 124.387908, -1.950464),
    node('N-T14', 'tengah', 'Sanana', 'Maluku Utara', 'POP', 100, 26, 'Online', 125.976861, -2.077306),
    node('N-T15', 'tengah', 'Manado', 'Sulawesi Utara', 'POP', 400, 241, 'Online', 124.821806, 1.445722),
    node('N-T16', 'tengah', 'Tahuna', 'Sulawesi Utara', 'Titik Layanan', 100, 30, 'Online', 125.455833, 3.616389),
    node('N-T17', 'tengah', 'Melonguane', 'Sulawesi Utara', 'Titik Layanan', 100, 24, 'Online', 126.695061, 4.002818),
    node('N-T18', 'tengah', 'Tobelo', 'Maluku Utara', 'POP', 200, 67, 'Online', 128.00888, 1.733056),
    node('N-T19', 'tengah', 'Ternate', 'Maluku Utara', 'POP', 200, 101, 'Online', 127.38637, 0.831667),
    node('N-T20', 'tengah', 'Sofifi', 'Maluku Utara', 'POP', 100, 38, 'Degradation', 127.56888, 0.738889),

    /* Timur */
    node('N-E01', 'timur', 'Labuan Bajo', 'Nusa Tenggara Timur', 'Landing Station', 100, 44, 'Online', 119.88, -8.5),
    node('N-E02', 'timur', 'Maumere', 'Nusa Tenggara Timur', 'POP', 100, 35, 'Online', 122.21, -8.62),
    node('N-E03', 'timur', 'Kupang', 'Nusa Tenggara Timur', 'POP', 400, 168, 'Online', 123.6, -10.17),
    node('N-E04', 'timur', 'Saumlaki', 'Maluku', 'Landing Station', 100, 21, 'Online', 131.3, -7.98),
    node('N-E05', 'timur', 'Ambon', 'Maluku', 'POP', 400, 189, 'Online', 128.18, -3.7),
    node('N-E06', 'timur', 'Sorong', 'Papua Barat Daya', 'POP', 200, 97, 'Online', 131.26, -0.88),
    node('N-E07', 'timur', 'Manokwari', 'Papua Barat', 'POP', 200, 72, 'Degradation', 134.06, -0.86),
    node('N-E08', 'timur', 'Biak', 'Papua', 'Landing Station', 200, 58, 'Online', 136.08, -1.18),
    node('N-E09', 'timur', 'Jayapura', 'Papua', 'POP', 400, 176, 'Online', 140.72, -2.53),
    node('N-E10', 'timur', 'Fakfak', 'Papua Barat', 'Landing Station', 100, 16, 'Maintenance', 132.3, -2.93),
    node('N-E11', 'timur', 'Kaimana', 'Papua Barat', 'Landing Station', 100, 14, 'Online', 133.75, -3.65),
    node('N-E12', 'timur', 'Timika', 'Papua Tengah', 'POP', 200, 83, 'Online', 136.9, -4.55),
    node('N-E13', 'timur', 'Merauke', 'Papua Selatan', 'POP', 200, 61, 'Online', 140.4, -8.5)
  ]
};

export const PAKET = {
  barat:  { label: 'Palapa Ring Barat',  color: '#ef4444' },
  tengah: { label: 'Palapa Ring Tengah', color: '#22c55e' },
  timur:  { label: 'Palapa Ring Timur',  color: '#3b82f6' }
};

export const PALAPA_DATA = { cables: CABLES, nodes: NODES, paket: PAKET };
export default PALAPA_DATA;
