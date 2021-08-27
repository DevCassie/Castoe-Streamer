const castoeStreamer = require('./src/index.js');

const jsonFile = new castoeStreamer.CastoeFile({
    file: 'test.json',
    automatic: true,
    overwrite: false
});

const data = {
    user: {
        name: 'Cassie',
        age: 19,
        id: 1
    }
}

jsonFile.send(data);