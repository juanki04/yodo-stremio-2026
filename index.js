const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const builder = new addonBuilder({
  id: 'yodo.vip.alternativo',
  version: '1.0.0',
  name: '⭐ YODO VIP PREMIUM',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: []
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    // Intentamos buscar en un motor espejo (es menos probable que bloquee)
    const res = await axios.get(`https://stremio-jackett.onrender.com/stream/${id}.json`, { timeout: 8000 });
    const streams = res.data.streams || [];

    if (streams.length === 0) {
      return { streams: [{ name: '⭐ YODO VIP', title: 'Buscando en servidor 2...', url: '' }] };
    }

    return { 
      streams: streams.slice(0, 10).map(s => ({
        name: '⭐ YODO VIP',
        title: '🎬 CASTELLANO\n' + (s.title ? s.title.split('\n')[0] : 'Calidad HD'),
        url: 'https://alldebrid.com/service/?url=' + encodeURIComponent(s.url || 'magnet:?xt=urn:btih:' + s.infoHash)
      })) 
    };
  } catch (e) {
    // Si el motor 2 falla, te envío un mensaje para que sepas qué pasa
    return { streams: [{ name: '⭐ YODO VIP', title: '⚠️ Servidor saturado, espera 10s', url: '' }] };
  }
});

serveHTTP(builder.getInterface(), { 
    port: process.env.PORT || 10000,
    address: '0.0.0.0' 
});


