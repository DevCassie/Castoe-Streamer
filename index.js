const castoeStreamer = require('./src/index.js');
const fs = require('fs');

// const castoeFile = new castoeStreamer.CastoeFile({
// 	stream: fs.createWriteStream('castoeLog')
// });

// castoeFile.write('test');


const fileTransport = require('./src/Transports/FileTransport.js');

const casFile = new fileTransport({
	automatic: true,
	overwrite: true,
	dirname: 'Backups',
	file: 'castoeFile.txt',
	options: { flags: 'a+' }
});

casFile.send('Well this is a suprise');

// casFile.read((data) => console.debug(data));