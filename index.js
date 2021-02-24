const castoeStreamer = require('./src/index.js');

const castoeConsole = new castoeStreamer.CastoeConsole({
	showType: true,
	traceFile: true,
	file: new castoeStreamer.CastoeFile({
		file: 'console.log'
	})
});

const error = new Error('Some error message');
const regex = new RegExp('w');
castoeConsole.error(error, 'Range Error');
castoeConsole.debug(regex, 'REGEX');	

const promise = new Promise((resolve, reject) => {
	const object = {
		user: {
			userID: '123',
			userName: 'Cas',
			userTag: 'Cas#19'
		},
		level: {
			level: 20,
			xp: 1000
		}
	}
	resolve('Succes');	
});

promise.then(res => castoeConsole.debug(res, 'Info'));