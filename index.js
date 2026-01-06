const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const builder = new addonBuilder({
  id: 'yodo.stremio.2026',
  version: '1.0.0',
  name: '⭐ YODO VIP PREMIUM',
  description: 'Contenido Premium - Enlaces Directos',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: []
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    const res = await axios.get(`https://torrentio.strem.fun/stream/${id}.json`, { timeout: 6000 });
    const streams = res.data.streams || [];
    
    return { 
      streams: streams.slice(0, 15).map(s => ({
        name: '⭐ YODO VIP',
        title: '🎬 CASTELLANO\n' + s.title.split('\n')[0],
        url: 'https://alldebrid.com/service/?url=' + encodeURIComponent('magnet:?xt=urn:btih:' + s.infoHash)
      })) 
    };
  } catch (e) {
    return { streams: [] };
  }
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 10000 });
