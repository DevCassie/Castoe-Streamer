const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.CastoeConsole({
	showType: true,
	traceFile: true,
	// file: new castoeStreamer.CastoeFile({
	// 	file: 'console.log'
	// })
});

const error = new Error('Some error message');
const regex = new RegExp('w');
castoeConsole.error(error, 'Range Error');
castoeConsole.debug(regex, 'REGEX');
castoeConsole.info(new Object({ id: 1, user: { name: 'Cassie', interest: 'design' }}));