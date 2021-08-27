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

const data = {
    user: {
        name: 'Cassie',
        age: 19,
        id: 1
    }
}

castoeLogger.debug('DATA DEBUG', data,);