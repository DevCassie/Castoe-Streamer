const Logger = require('./src/Transports/index.js');

const castoeLog = new Logger.File({
	file: 'file.txt',
	automatic: true,
	overwrite: true
});

castoeLog.send('Testing');

const castoeConsole = new Logger.Console({
	name: 'Castoe COnsole',
	date: 'LT'	
});

castoeConsole.send('Test');