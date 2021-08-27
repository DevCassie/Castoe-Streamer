/* eslint-disable no-unused-vars */
const CastoeConsole = require('./ConsoleTransport.js');
const CastoeFile = require('./FileTransport.js');
const CastoeStream = require('./StreamTransport.js');

/**
 * @type {CastoeConsole}
 */
Object.defineProperty(exports, 'CastoeConsole', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./ConsoleTransport');
	}	
});

/**
 * @type {CastoeStream}
 */
Object.defineProperty(exports, 'CastoeStream', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./StreamTransport');
	}
});

/**
 * @type {CastoeFile}
 */
Object.defineProperty(exports, 'CastoeFile', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./FileTransport');
	}
});