const os = require('os');
const fs = require('fs');
const zlib = require('zlib');
const util = require('util');
const path = require('path');
const colog = require('colog');
const moment = require('moment');
const { Transform } = require('stream');

const CastoeFile = require('./FileTransport.js');

/**
 * @typedef CastoeConsoleOptions
 * @property {String?} [name=''] Name of the console.
 * @property {String?} [date=''] Format for the date.
 * @property {Boolean?} [traceFile=false] Wether or not the console should return the file it's called from.
 * @property {Boolean?} [showType=false] Should the output show which type the input is?

 */
//  * @property {CastoeConsoleColorOptions?} [colors={}] Which colours should be what?

/**
 * @typedef CastoeConsoleColorOptions
 * @property {String} [error='red'] Which color for the bigint type?
 * @property {String} [debug='green'] Which color for the boolean type?
 * @property {String} [info='blue'] Which color for the function type?
 * @property {String} [warn='yellow'] Which color for the number type?
 * @property {String} [send='white'] Which color for the object type?
 */

/**
 * @type {Console}
 * @extends {Transform}
 * @example new Transports.Console({ traceFile: true, colors: {error: 'red', debug: 'green', info: 'blue', warn: 'yellow', send: 'white'}, date: 'LTS', showType: true });
 * @returns {undefined}
 */
module.exports = class CastoeConsole extends Transform {
	/**
	 * Constructor function for the Console transport object responsible for
	 * persisting log messages and metadata to a terminal or TTY.
	 * @param {CastoeConsoleOptions} [options] - Options for this instance.
	 */
	constructor(options) {
		super(options);

		this.options = options;
		/**
		 * @type {String}
		 */
		this.name = options.name;
		/**
		 * @type {String}
		 */
		this.date = options.date;
		/**
		 * @type {Boolean}
		 */
		this.traceFile = options.traceFile || false;
		/**
		 * @type {Boolean}
		 */
		this.showType = options.showType || false;
		/**
		 * @type {Object}
		 */
		this.format = options.format;
		/**
		 * @type {CastoeFile}
		 */
		this.file = options.file;
		this.stackIndex = options.stackIndex || 1;
		this.eol = options.eol || os.EOL;

		this.setMaxListeners(30);
		// /**
		//  * @type {CastoeConsoleColorOptions} 
		//  */
		// this.colors = options.colors;

		// if (this.colors) {
		// 	if (options.colors.error && options.colors.info && options.colors.warn && options.colors.warn && options.colors.debug && options.colors.send) {
		// 		this.colors = {
		// 			error: options.colors.error,
		// 			warn: options.colors.warn,
		// 			debug: options.colors.debug,
		// 			info: options.colors.info,
		// 			send: options.colors.send
		// 		}
		// 	} else {
		// 		throw new Error('options.colors needs to be an Object like this:\n{error: String, info: String, warn: String, debug: String, send: String}');
		// 	}
		// }
		this.levels = {
			0: 'send',
			1: 'info',
			2: 'debug',
			3: 'warn',
			4: 'error'
		}

		Object.values(this.levels).forEach(value => {
			if (value === 'send') {
				this[value] = function(info, callback) {
					const newInfo = `${this._handleOptions(info)} ${this._handleInputTypes(info)}${this.eol}`;
					if (this.file && this.file instanceof CastoeFile) {
						this.file.send(newInfo);
						if (process.stdout.isTTY) return process.stdout.write(colog.white(newInfo), callback);
					}
					if (!this.file || !(this.file instanceof CastoeFile)) {
						if (process.stdout.isTTY) return process.stdout.write(colog.white(newInfo), callback);
					}
				}
			} else if (value === 'info') {
				this[value] = function(info, callback) {
					const newInfo = `${this._handleOptions(info)} ${this._handleInputTypes(info)}${this.eol}`;
					if (this.file && this.file instanceof CastoeFile) {
						this.file.send(newInfo);
						if (process.stdout.isTTY) return process.stdout.write(colog.cyan(newInfo), callback);
					}
					if (!this.file || !(this.file instanceof CastoeFile)) {
						if (process.stdout.isTTY) return process.stdout.write(colog.cyan(newInfo), callback);
					}
				}	
			} else if (value === 'debug') {
				this[value] = function(info, name, callback) {
					const newInfo = `${this._handleOptions(info, name)} ${this._handleInputTypes(info)}${this.eol}`;
					if (this.file && this.file instanceof CastoeFile) {
						this.file.send(newInfo);
						if (process.stdout.isTTY) return process.stdout.write(colog.green(newInfo), callback);
					}
					if (!this.file || !(this.file instanceof CastoeFile)) {
						if (process.stdout.isTTY) return process.stdout.write(colog.green(newInfo), callback);
					}
				}
			} else if (value === 'warn') {
				this[value] = function(info, callback) {
					const newInfo = `${this._handleOptions(info)} ${this._handleInputTypes(info)}${this.eol}`;
					if (this.file && this.file instanceof CastoeFile) {
						this.file.send(newInfo);
						if (process.stdout.isTTY) return process.stdout.write(colog.yellow(newInfo), callback);
					}
					if (!this.file || !(this.file instanceof CastoeFile)) {
						if (process.stdout.isTTY) return process.stdout.write(colog.yellow(newInfo), callback);
					}
				}
			} else if (value === 'error') {
				this[value] = function(info, name, callback) {
					const newInfo = `${this._handleOptions(info, name)} ${this._handleInputTypes(info)}${this.eol}`;
					if (this.file && this.file instanceof CastoeFile) {
						this.file.send(newInfo);
						if (process.stdout.isTTY) return process.stdout.write(colog.red(newInfo), callback);
					}
					if (!this.file || !(this.file instanceof CastoeFile)) {
						if (process.stdout.isTTY) return process.stdout.write(colog.red(newInfo), callback);
					}
				}
			}
		});
	}

	/**
	 * Core clear function of the CastoeConsole
	 * @returns {Promise<void>}
	 */
	clear() {
		process.stdout.cursorTo(0,0);
		process.stdout.clearLine(0);
		process.stdout.clearScreenDown();	
	}

	/**
	 * @private
	 */
	_getFileCall() {
		const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
		const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
		const stackList = new Error().stack.split('\n').slice(3);
		const s = stackList[this.stackIndex];
		const sp = stackReg.exec(s) || stackReg2.exec(2);

		const data = {};

		if (sp && sp.length === 5) {
			data.method = sp[1];
			data.path = sp[2];
			data.line = sp[3];
			data.position = sp[4];
			data.file = path.basename(data.path);
			data.stack = stackList.join('\n');
			return `${data.file}:${data.line}`;
		}
	}

	/**
	 * Function to check for the input, to change the writeable states.
	 * @param {undefined} input 
	 * @returns {undefined}
	 * @private
	 */
	_typeOfInput(input) {
		if (input instanceof Error) {
			if (process.stdout.isTTY) return 'Instanceof Error';
			if (this.file && this.file instanceof CastoeFile) return 'Instanceof Error';
		} 

		if (typeof input === 'bigint') {
			if (process.stdout.isTTY) return 'Typeof Bigint';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Bigint';
		} else if (typeof input === 'boolean') {
			if (process.stdout.isTTY) return 'Typeof Boolean';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Boolean';
		} else if (typeof input === 'function') {
			if (process.stdout.isTTY) return 'Typeof Function';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Function';
		} else if (typeof input === 'number') {
			if (process.stdout.isTTY) return 'Typeof Number';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Number';
		} else if (typeof input === 'object') {
			if (process.stdout.isTTY) return 'Typeof Object';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Object';
		} else if (typeof input === 'string') {
			if (process.stdout.isTTY) return 'Typeof String';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof String';
		} else if (typeof input === 'symbol') {
			if (process.stdout.isTTY) return 'Typeof Symbol';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Symbol';
		} else if (typeof input === 'undefined') {
			if (process.stdout.isTTY) return 'Typeof Undefined';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Undefined';
		} else {
			if (process.stdout.isTTY) return undefined;
			if (this.file && this.file instanceof CastoeFile) return 'undefined';
		}
	}

	/**
	 * Function to handle different types of inputs from the user.
	 * @param {mixed} input 
	 * @returns {undefined}
	 * @private
	 */
	_handleInputTypes(input) {
		if (input instanceof Error) {
			if (process.stdout.isTTY) return input.message;
			if (this.file && this.file instanceof CastoeFile) return input.message.toString();
		} else if (input instanceof RegExp) {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		}

		if (typeof input === 'bigint') {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'boolean') {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'function') {
			if (process.stdout.isTTY) return `function ${input.name}() { native code }`;
			if (this.file && this.file instanceof CastoeFile) return `function ${input.name}() { native code }`;
		} else if (typeof input === 'number') {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'object') {
			const Objectarray = [];
			Objectarray.push(input);
			if (process.stdout.isTTY) return util.inspect(input, true, input.size, false);
			if (this.file && this.file instanceof CastoeFile) return util.inspect(input, true, input.size, false);
		} else if (typeof input === 'string') {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'symbol') {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'undefined') {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return 'undefined';
		} else {
			if (process.stdout.isTTY) return input;
			if (this.file && this.file instanceof CastoeFile) return 'undefined';
		}
	}

	/**
	 * Basic option handler.
	 * @param {Object} info 
	 * @param {String?} name
	 * @privates
	 */
	_handleOptions(info, name) {
		if (name) {
			if (this.name && this.date && this.showType === true && this.traceFile === true) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (this.name && this.date && this.showType === true && this.traceFile === false) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (this.name && this.date && this.showType === false && this.traceFile === true) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} ] [${name}]: `;
			} else if (this.name && this.date && this.showType === false && this.traceFile === false) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} ] [${name}]: `;
			} else if (this.name && !this.date && this.showType === true && this.traceFile === true) {
				return `[ ${this.name} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (this.name && !this.date && this.showType === false && this.traceFile === true) {
				return `[ ${this.name} | ${this._getFileCall()} ] [${name}]: `;
			} else if (this.name && !this.date && this.showType === true && this.traceFile === false) {
				return `[ ${this.name} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (this.name && !this.date && this.showType === false && this.traceFile === false) {
				return `[ ${this.name} ] [${name}]: `;
			} else if (this.name) {
				return `[ ${this.name} ] [${name}]: `;
			} else if (!this.name && this.date && this.showType === true && this.traceFile === false) {
				return `[${moment(new Date()).format(this.date)} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (!this.name && this.date && this.showType === false && this.traceFile === true) {
				return `[ ${moment(new Date()).format(this.date)} | ${this._getFileCall()} ] [${name}]: `;
			} else if (!this.name && this.date && this.showType === false && this.traceFile === false) {
				return `[ ${moment(new Date()).format(this.date)} ] [${name}]: `;
			} else if (!this.name && !this.date && this.showType === true && this.traceFile === true) {
				return `[ ${this._getFileCall()} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (!this.name && !this.date && this.showType === false && this.traceFile === true) {
				return `[ ${this._getFileCall()} ] [${name}]: `;
			} else if (!this.name && !this.date && this.showType === true && this.traceFile === false) {
				return `[ ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (!this.name && !this.date && this.showType === false && this.traceFile === false) {
				return `[${name}]: `;
			} else {
				return `[${name}]: `
			}
		}

		if (this.name && this.date && this.showType === true && this.traceFile === true) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ]`;
		} else if (this.name && this.date && this.showType === true && this.traceFile === false) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._typeOfInput(info)} ]`;
		} else if (this.name && this.date && this.showType === false && this.traceFile === true) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} ]`;
		} else if (this.name && this.date && this.showType === false && this.traceFile === false) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} ]`;
		} else if (this.name && !this.date && this.showType === true && this.traceFile === true) {
			return `[ ${this.name} | ${this._getFileCall()} | ${this._typeOfInput(info)} ]`;
		} else if (this.name && !this.date && this.showType === false && this.traceFile === true) {
			return `[ ${this.name} | ${this._getFileCall()} ]`;
		} else if (this.name && !this.date && this.showType === true && this.traceFile === false) {
			return `[ ${this.name} | ${this._typeOfInput(info)} ]`;
		} else if (this.name && !this.date && this.showType === false && this.traceFile === false) {
			return `[ ${this.name} ]`;
		} else if (!this.name && this.date && this.showType === true && this.traceFile === false) {
			return `[ ${moment(new Date()).format(this.date)} | ${this._typeOfInput(info)} ]`;
		} else if (!this.name && this.date && this.showType === false && this.traceFile === true) {
			return `[ ${moment(new Date()).format(this.date)} | ${this._getFileCall()} ]`;
		} else if (!this.name && this.date && this.showType === false && this.traceFile === false) {
			return `[ ${moment(new Date()).format(this.date)} ]`;
		} else if (!this.name && !this.date && this.showType === true && this.traceFile === true) {
			return `[ ${this._getFileCall()} | ${this._typeOfInput(info)} ]`;
		} else if (!this.name && !this.date && this.showType === false && this.traceFile === true) {
			return `[ ${this._getFileCall()} ]`;
		} else if (!this.name && !this.date && this.showType === true && this.traceFile === false) {
			return `[ ${this._typeOfInput(info)} ]`;
		} else if (!this.name && !this.date && this.showType === false && this.traceFile === false) {
			return '';
		}
	}

	createGzip() {
		const gzip = zlib.createGzip();
		if (!this.file) throw new Error('File doesn\'t exists.');
		const readFile = fs.createReadStream(this.file.file);
		const writeFile = fs.createWriteStream(`${this.file.file}.gz`);
		if (!readFile) {
			throw new Error('File does not exists.');		
		}
		return readFile.pipe(gzip).pipe(writeFile);
	}
}