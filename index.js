const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.Transports.Console({
	name: 'Castoe Console Testing',
	traceFile: true,
	showType: false
});

// castoeConsole.send('Testing');

// castoeConsole.send(true);

castoeStreamer.Functions.rename('./src/TestFile.md', './Testing.md');