const Logger = require('./src/Transports/index.js');
/* 
const castoeLog = new Logger.File({
	file: 'file.txt',
	automatic: true,
	overwrite: true,
});
castoeLog.send('Testing'); */

const castoeConsole = new Logger.Console({
	name: 'Console',
	date: 'LT',
	showType: true,
	showFile: true
})

const x = false;

castoeConsole.send(x);