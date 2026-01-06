const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const builder = new addonBuilder({
  id: 'yodo.vip.premium.fixed',
  version: '2.0.0',
  name: '⭐ YODO VIP PREMIUM',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: []
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    // CAMUFLAJE: Engañamos al buscador para que crea que somos un navegador Chrome normal
    const res = await axios.get(`https://torrentio.strem.fun/stream/${id}.json`, {
      timeout: 7000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'es-ES,es;q=0.9'
      }
    });

    const streams = res.data.streams || [];
    
    if (streams.length === 0) {
       // Si no hay nada, mandamos este mensaje para saber que el código se ejecutó
       return { streams: [{ name: '⭐ YODO VIP', title: 'Buscando fuentes alternativas...', url: '' }] };
    }

    return { 
      streams: streams.slice(0, 10).map(s => ({
        name: '⭐ YODO VIP',
        title: '🎬 CASTELLANO\n' + s.title.split('\n')[0],
        url: 'https://alldebrid.com/service/?url=' + encodeURIComponent('magnet:?xt=urn:btih:' + s.infoHash)
      })) 
    };
  } catch (e) {
    // Si Torrentio nos bloquea, devolvemos un mensaje de aviso
    return { streams: [{ name: '⭐ YODO VIP', title: '⚠️ Reintentando conexión...', url: '' }] };
  }
});

serveHTTP(builder.getInterface(), { 
    port: process.env.PORT || 10000,
    address: '0.0.0.0' 
});


