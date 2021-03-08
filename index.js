const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.CastoeConsole({
	name: 'Maverick',
	traceFile: true,
	showLevel: true,
	showBadge: true
});
castoeConsole.info({
	userID: 1,
	user: 'Maverick',
	bot: true,
	notes: 'Maverick is going to be amazing.'
});

setTimeout(() => {
	castoeStreamer.Functions.Clear(process.stdout);
}, 10000);