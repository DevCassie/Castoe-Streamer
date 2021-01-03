Object.defineProperty(exports, 'Clone', {
	enumerable: false,
	configurable: false,
	get() {
		return require('./Functions/index.js').clone;
	},
});

Object.defineProperty(exports, 'Delete', {
	enumerable: true,
	configurable: true,
	get() {
		return require('./Functions/index.js').delete;
	}	
});

Object.defineProperty(exports, 'Rename', {
	enumerable: true,
	configurable: true,
	get() {
		return require('./Functions/index.js').rename;
	}	
})

Object.defineProperty(exports, 'Transports', {
	configurable: true,
	enumerable: true,
	get() {
		return require('./Transports/index.js');
	},
});