const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.Transports.Console({
	name: 'Castoe Console Testing',
	traceFile: true,
	date: 'LTS',
	showType: true
});

castoeConsole.send('Testing');

castoeConsole.send(true);