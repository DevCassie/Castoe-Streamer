const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.CastoeConsole({
	name: 'Maverick',
	traceFile: true,
	showLevel: true,
	showBadge: true,
	date: 'LT'
});
castoeConsole.info({
	userID: 1,
	user: 'Maverick',
	bot: true,
	notes: 'Maverick is going to be amazing.'
});

castoeConsole.send('This is a test');