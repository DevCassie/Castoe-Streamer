const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.Transports.Console({
	name: 'Castoe Testing',
	traceFile: true,
	showType: true
});

castoeConsole.send('Testing 123');