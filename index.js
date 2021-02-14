const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.CastoeConsole({
	showType: false,
	traceFile: false,
	// file: new castoeStreamer.CastoeFile({
	// 	file: 'console.log'
	// })
});

// const file = new castoeStreamer.CastoeFile({
// 	file: 'Test.txt',
// 	automatic: false
// });
castoeConsole.send(false);
castoeConsole.debug('User with identifier 39247194032061884 authenticated using OAuth2.', 'AUTHENTICATION');
castoeConsole.error('Some range error occured.', 'Range Error');
castoeConsole.info({
	userID: 12357374756,
	user: 'Cassie',
	userRoles: {
		1: 'Amazing',
		2: 'Awesome',
		3: 'Loved'	
	}
});
castoeConsole.warn('This is a warning');

// castoeConsole.createGzip();

// file.send('test test');

// file.createGzip();