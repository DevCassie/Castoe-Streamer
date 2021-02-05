const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.CastoeConsole({
	showType: true,
	date: 'LT',
	traceFile: true,
	format: {
		name: '{transportname}',
		divider: ' - ',
		file: '{filename}',
		date: '{date}',
		output: '{input}'	
	},
	file: new castoeStreamer.CastoeFile({
		file: 'console.log'
	})
});
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

castoeConsole.createGZip(false);
