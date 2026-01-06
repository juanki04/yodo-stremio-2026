const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
    id: 'yodo.test.final',
    version: '1.0.0',
    name: '⭐ TEST YODO',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    console.log("Petición recibida para ID:", args.id);
    
    // ESTO ES UN ENLACE FIJO DE PRUEBA
    // Si ves esto en CUALQUIER película, el servidor funciona.
    return Promise.resolve({ 
        streams: [{ 
            name: '⭐ YODO VIP', 
            title: '✅ EL SERVIDOR RESPONDE OK\nPulsa aquí para test', 
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
        }] 
    });
});

serveHTTP(builder.getInterface(), { 
    port: process.env.PORT || 10000,
    address: '0.0.0.0' 
});
