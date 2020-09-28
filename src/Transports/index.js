/**
 * @type {Console}
 */
Object.defineProperty(exports, 'Console', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./ConsoleTransport');
	}
});

/**
 * @type {Stream}
 */
Object.defineProperty(exports, 'Stream', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./stream');
	}	
});

Object.defineProperty(exports, 'File', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./FileTransport');	
	}
});