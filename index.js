const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const builder = new addonBuilder({
  id: 'yodo.vip.final.2026',
  version: '1.0.0',
  name: '⭐ YODO VIP PREMIUM',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: []
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    // Intentamos "engañar" al buscador con una identidad de navegador real
    const res = await axios.get(`https://torrentio.strem.fun/stream/${id}.json`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    const streams = res.data.streams || [];
    
    if (streams.length === 0) {
      return { streams: [{ name: '⭐ YODO VIP', title: '⚠️ Buscador bloqueado - Reintenta', url: '' }] };
    }

    return { 
      streams: streams.slice(0, 15).map(s => ({
        name: '⭐ YODO VIP',
        title: '🎬 CASTELLANO\n' + s.title.split('\n')[0],
        url: 'https://alldebrid.com/service/?url=' + encodeURIComponent('magnet:?xt=urn:btih:' + s.infoHash)
      })) 
    };
  } catch (e) {
    // Si Torrentio nos rechaza, este mensaje aparecerá en la película
    return { streams: [{ name: '⭐ YODO VIP', title: '🚫 Error: El buscador no responde', url: '' }] };
  }
});

serveHTTP(builder.getInterface(), { 
    port: process.env.PORT || 10000,
    address: '0.0.0.0' 
});


