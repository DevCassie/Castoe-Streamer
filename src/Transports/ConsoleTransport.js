const os = require('os');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const util = require('util');
const moment = require('moment');
const { Transform } = require('stream');	
const colors = require('colors/safe');

const CastoeFile = require('./FileTransport.js');

/**
 * @typedef CastoeConsoleOptions
 * @property {String?} [name=''] Name of the console.
 * @property {String?} [date=''] Format for the date.
 * @property {Boolean?} [traceFile=false] Wether or not the console should return the file it's called from.
 * @property {Boolean?} [showType=false] Should the output show which type the input is?
 * @property {CastoeConsoleColorOptions?} [colors={}] Which colours should be what?
 */

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
		this.name = options.name || 'Castoe Console';
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
		this.stackIndex = options.stackIndex || 2;
		this.stderrLevels = this._stringArrayToSet(options.stderrLevels);
		this.consoleWarnLevels = this._stringArrayToSet(options.consoleWarnLevels);
		this.eol = options.eol || os.EOL;

		this.setMaxListeners(30);
		/**
		 * @type {CastoeConsoleColorOptions} 
		 */
		this.colors = options.colors;

		if (this.colors) {
			if (options.colors.error && options.colors.info && options.colors.warn && options.colors.warn && options.colors.debug && options.colors.send) {
				colors.setTheme({
					error: options.colors.red,
					info: options.colors.info,
					warn: options.colors.warn,
					debug: options.colors.green,
					send: options.colors.send
				});
			} else {
				throw new Error('options.colors needs to be an Object like this:\n{error: String, info: String, warn: String, debug: String, send: String}');
			}
		} else {
			options.colors = colors.setTheme({
				error: 'red',
				info: 'blue',
				warn: 'yellow',
				debug: 'green',
				send: 'white'
			});
		}

		// this.levels = [ 'info', 'debug', 'warn', 'error' ];
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
					return this.write(info, '', callback);
				}
			} else if (value === 'info') {
				this[value] = function(info, callback) {
					return this.write(info, '', callback);
				}	
			} else if (value === 'debug') {
				this[value] = function(info, name, callback) {
					return this.write(info, name, callback);
				}
			} else if (value === 'warn') {
				this[value] = function(info, callback) {
					return this.write(info, '', callback);
				}
			} else if (value === 'error') {
				this[value] = function(info, name, callback) {
					return this.write(info, name, callback);
				}
			}
		});
		// for (const level of this.levels) {
		// 	if (this[level] === 'error') {
		// 		this[level] = function(info, name, callback) {
		// 			return this.write(info, name, callback);
		// 		}
		// 	} else if (this[level] === 'debug') {
		// 		this[level] = function(info, name, callback) {
		// 			return this.write(info, name, callback);
		// 		}
		// 	} else {
		// 		this[level] = function(info, callback) {
		// 			return this.write(info, callback)
		// 		}
		// 	}
		// }
	}

	/**
	 * Core clear function of the CastoeConsole
	 * @returns {Promise<void>}
	 */
	clear() {
		process.stdout.cursorTo(0,0);
		process.stdout.clearLine(0);
		process.stdout.clearScreenDown();
		process.stdout.resume();
	}

	/**
   * Returns a Set-like object with strArray's elements as keys (each with the
   * value true).
   * @param {Array} strArray - Array of Set-elements as strings.
   * @param {?string} [errMsg] - Custom error message thrown on invalid input.
   * @returns {Object} - Returns an Object.
   * @private
   */
	_stringArrayToSet(strArray, errMsg) {
		if (!strArray)
			return {};

		errMsg = errMsg || 'Can\'t make set from type other than Array of string elements';

		if (!Array.isArray(strArray)) {
			throw new Error(errMsg);
		}

		return strArray.reduce((set, el) => {
			if (typeof el !== 'string') {
				throw new Error(errMsg);
			}
			set[el] = true;

			return set;
		}, {});
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
		}

		return `${JSON.stringify(data.file).replace('"', '').replace('"', '')}:${JSON.stringify(data.line).replace('"', '').replace('"', '')}`;
	}

	/**
	 * Function to check for the input, to change the writeable states.
	 * @param {undefined} input 
	 * @returns {undefined}
	 * @private
	 */
	_typeOfInput(input) {
		if (typeof input === 'bigint') {
			if (process.stdout) return 'Typeof Bigint';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Bigint';
		} else if (typeof input === 'boolean') {
			if (process.stdout) return 'Typeof Boolean';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Boolean';
		} else if (typeof input === 'function') {
			if (process.stdout) return 'Typeof Function';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Function';
		} else if (typeof input === 'number') {
			if (process.stdout) return 'Typeof Number';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Number';
		} else if (typeof input === 'object') {
			if (process.stdout) return 'Typeof Object';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Object';
		} else if (typeof input === 'string') {
			if (process.stdout) return 'Typeof String';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof String';
		} else if (typeof input === 'symbol') {
			if (process.stdout) return 'Typeof Symbol';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Symbol';
		} else if (typeof input === 'undefined') {
			if (process.stdout) return 'Typeof Undefined';
			if (this.file && this.file instanceof CastoeFile) return 'Typeof Undefined';
		} else {
			if (process.stdout) return undefined;
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
		if (typeof input === 'bigint') {
			if (process.stdout) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'boolean') {
			if (process.stdout) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'function') {
			if (process.stdout) return `function ${input.name}() { native code }`;
			if (this.file && this.file instanceof CastoeFile) return `function ${input.name}() { native code }`;
		} else if (typeof input === 'number') {
			if (process.stdout) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'object') {
			const Objectarray = [];
			Objectarray.push(input);
			if (process.stdout) JSON.stringify(input, null, 1).replace(/"([^"]+)":/gm, '$1:');
			if (this.file && this.file instanceof CastoeFile) return JSON.stringify(input, null, 1).replace(/"([^"]+)":/gm, '$1:');
		} else if (typeof input === 'string') {
			if (process.stdout) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'symbol') {
			if (process.stdout) return input;
			if (this.file && this.file instanceof CastoeFile) return input;
		} else if (typeof input === 'undefined') {
			if (process.stdout) return input;
			if (this.file && this.file instanceof CastoeFile) return 'undefined';
		} else {
			if (process.stdout) return undefined;
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
			if (this.date && this.showType === true && this.traceFile === true) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (this.date && this.showType === true && this.traceFile === false) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (this.date && this.showType === false && this.traceFile === true) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} ] [${name}]: `;
			} else if (this.date && this.showType === false && this.traceFile === false) {
				return `[ ${this.name} | ${moment(new Date()).format(this.date)} ] [${name}]: `;
			} else if (!this.date && this.showType === true && this.traceFile === true) {
				return `[ ${this.name} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (!this.date && this.showType === false && this.traceFile === true) {
				return `[ ${this.name} | ${this._getFileCall()} ] [${name}]: `;
			} else if (!this.date && this.showType === true && this.traceFile === false) {
				return `[ ${this.name} | ${this._typeOfInput(info)} ] [${name}]: `;
			} else if (!this.date && this.showType === false && this.traceFile === false) {
				return `[ ${this.name} ] [${name}]: `;
			} else {
				return `[ ${this.name} ] [${name}]: `;
			}
		}

		if (this.date && this.showType === true && this.traceFile === true) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ]`;
		} else if (this.date && this.showType === true && this.traceFile === false) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._typeOfInput(info)} ]`;
		} else if (this.date && this.showType === false && this.traceFile === true) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} ]`;
		} else if (this.date && this.showType === false && this.traceFile === false) {
			return `[ ${this.name} | ${moment(new Date()).format(this.date)} ]`;
		} else if (!this.date && this.showType === true && this.traceFile === true) {
			return `[ ${this.name} | ${this._getFileCall()} | ${this._typeOfInput(info)} ]`;
		} else if (!this.date && this.showType === false && this.traceFile === true) {
			return `[ ${this.name} | ${this._getFileCall()} ]`;
		} else if (!this.date && this.showType === true && this.traceFile === false) {
			return `[ ${this.name} | ${this._typeOfInput(info)} ]`;
		} else if (!this.date && this.showType === false && this.traceFile === false) {
			return `[ ${this.name} ]`;
		} else {
			return `[ ${this.name} ]`;
		}
	}

	/**
	 * 
	 * @param {*} input 
	 * @param {String?} name 
	 * @param {Function} callback 
	 * @private
	 */
	write(input, name, callback) {
		setImmediate(() => this.emit('logged', input));
		if (process.stdout) {
			if (name) {
				process.stdout.write(`${this._handleOptions(input, name)}${this._handleInputTypes(input)}${this.eol}`);
				if (this.file && this.file instanceof CastoeFile) {
					this.file.send(`${this._handleOptions(input, name)}${this._handleInputTypes(input)}${this.eol}`);
				}
			} else {
				process.stdout.write(`${this._handleOptions(input)} ${this._handleInputTypes(input)}${this.eol}`);
				if (this.file && this.file instanceof CastoeFile) {
					this.file.send(`${this._handleOptions(input)} ${this._handleInputTypes(input)}${this.eol}`);
				}
			}
		} else {
			if (name) {
				console.log(`${this._handleOptions(input, name)}${this._handleInputTypes(input)}${this.eol}`);
				if (this.file && this.file instanceof CastoeFile) {
					this.file.send(`${this._handleOptions(input, name)}${this._handleInputTypes(input)}${this.eol}`);
				}
			} else {
				console.log(`${this._handleOptions(input)} ${this._handleInputTypes(input)}${this.eol}`);
				if (this.file && this.file instanceof CastoeFile) {
					this.file.send(`${this._handleOptions(input)} ${this._handleInputTypes(input)}${this.eol}`);
				}
			}
		}

		if (callback) {
			callback();
		}
		return;
	}
}