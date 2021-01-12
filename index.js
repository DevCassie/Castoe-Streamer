const castoeStreamer = require('./src/index.js');
const fs = require('fs');

const castoeConsole = new castoeStreamer.CastoeConsole({});

castoeConsole.send('Hiii')