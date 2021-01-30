const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.CastoeConsole({
	name: 'Logger',
	showType: true,
	traceFile: true,
});

castoeConsole.send('info');

castoeConsole.debug('User with identifier 39247194032061884 authenticated using OAuth2.', 'AUTHENTICATION');

castoeConsole.error('Some error occured.', 'Range Error');