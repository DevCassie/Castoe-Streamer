const CastoeConsole = require('./ConsoleTransport.js');
const CastoeStream = require('./StreamTransport.js');

// module.exports = {
// 	CastoeFile: require('./FileTransport.js'),
// 	CastoeStream: require('./StreamTransport.js'),
// 	CastoeConsole: require('./ConsoleTransport.js'),
// }

/**
 * @type {CastoeConsole}
 */
Object.defineProperty(exports, 'CastoeConsole', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./ConsoleTransport.js');
	}	
});

/**
 * @type {CastoeStream}
 */
Object.defineProperty(exports, 'CastoeStream', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./StreamTransport.js');
	}
});

Object.defineProperty(exports, 'CastoeFile', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./FileTransport.js');
	}
});