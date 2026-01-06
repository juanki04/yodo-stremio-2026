const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const manifest = {
  id: 'yodo.stremio.2026.final', // Cambiamos ID para forzar refresco
  version: '1.1.0',
  name: '⭐ YODO VIP PREMIUM',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ id }) => {
  console.log("Buscando para ID:", id); // Esto nos servirá para ver fallos en Render
  try {
    const res = await axios.get(`https://torrentio.strem.fun/stream/${id}.json`, { 
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const streams = res.data.streams || [];
    
    if (streams.length === 0) {
      return { streams: [{ name: '⭐ YODO VIP', title: 'Buscando fuentes... reintenta en 5s', url: '' }] };
    }

    return { 
      streams: streams.slice(0, 15).map(s => ({
        name: '⭐ YODO VIP',
        title: '🎬 CASTELLANO\n' + (s.title.split('\n')[0]),
        url: 'https://alldebrid.com/service/?url=' + encodeURIComponent('magnet:?xt=urn:btih:' + s.infoHash)
      })) 
    };
  } catch (e) {
    console.error("Error en búsqueda:", e.message);
    return { streams: [] };
  }
});

// ESTO ES LO IMPORTANTE PARA RENDER:
serveHTTP(builder.getInterface(), { 
    port: process.env.PORT || 10000,
    address: '0.0.0.0' // OBLIGATORIO para que Render abra la puerta al exterior
});
