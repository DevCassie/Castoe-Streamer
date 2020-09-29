const Logger = require('./src/Transports/index.js');

const castoeLog = new Logger.Console({
	name: 'Castoe Console',
	date: 'LT'
});

castoeLog.send('Testing');