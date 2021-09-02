const castoeStreamer = require('./src/index.js');

const jsonFile = new castoeStreamer.CastoeFile({
    file: 'test.json',
    automatic: true,
    overwrite: false
});
const castoeLogger = new castoeStreamer.CastoeConsole({
    traceFile: true,
    name: 'Castoe Console',
    showtype: true,
    showBadge: true
});

const castoeFile = new castoeStreamer.CastoeFile({
    file: 'test.txt',
    overwrite: false,
    automatic: true
});

castoeFile.send('Testing 123');