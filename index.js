const castoeStreamer = require('./src/index.js');
const fs = require('fs');

const castoeFile = new castoeStreamer.CastoeFile({
	stream: fs.createWriteStream('castoeLog')
});

castoeFile.write('test');