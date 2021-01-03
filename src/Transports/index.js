Object.defineProperty(exports, 'CastoeConsole', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./ConsoleTransport');
	}
});

Object.defineProperty(exports, 'CastoeStream', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./stream');
	}	
});

Object.defineProperty(exports, 'CastoeFile', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./FileTransport');	
	}
});