const os = require('os');
const path = require('path');
const moment = require('moment');
const { Transform } = require('stream');
const colors = require('colors/safe');

// eslint-disable-next-line no-unused-vars
const { levels } = require('../Configuration/index.js');

/**
 * @type {Console}
 * @extends {Transform}
 */
module.exports = class CastoeConsole extends Transform {
	/**
   * Constructor function for the Console transport object responsible for
   * persisting log messages and metadata to a terminal or TTY.
   * @param {!Object} [options={}] - Options for this instance.
   */	
	constructor(options = {}) {
		super(options);

		this.name = options.name || 'Castoe Console';
		this.date = options.date;
		this.traceFile = options.traceFile || false;
		this.showType = options.showType || false;
		this.stackIndex = options.stackIndex || 0;
		this.stderrLevels = this._stringArrayToSet(options.stderrLevels);
		this.consoleWarnLevels = this._stringArrayToSet(options.consoleWarnLevels);
		this.eol = options.eol || os.EOL;

		this.setMaxListeners(30);
		this.colors = options.colors || colors.setTheme({
			bigint: 'green',
			boolean: 'magenta',
			function: 'cyan',
			number: 'yellow',
			object: 'blue',
			string: 'white',
			symbol: 'gray'
		});
	}

	/**
	 * Core logging method exposed to Castoe Console Logger.
	 * @param {*} info - Input for the log.
	 * @param {*} callback - Callback function.
	 */
	send(info, callback) {
		setImmediate(() => this.emit('logged', info));

		if (this.stderrLevels[info]) {
			if (process.stderr) {
				if (this.date && this.showType === true) {
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				} else if (this.date && this.showType === false) {
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				}
	
			
			} else {
				if (this.date && this.showType === true) {
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				} else if (this.date && this.showType === false) {
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				}
			}

			if (callback) {
				callback();
			}
		} else if (this.consoleWarnLevels[info]) {
			if (process.stderr) {
				if (this.date && this.showType === true) {
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				} else if (this.date && this.showType === false){
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				}
			} else {
				if (this.date && this.showType === true) {
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				} else if (this.date && this.showType === false){
					process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
				}
			}

			if (callback) {
				callback();
			}
			return;
		}

		if (process.stdout) {
			if (this.date && this.showType === true) {
				process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] - ${this._handleInputTypes(info)}${this.eol}`);		
			} else if (this.date && this.showType === false) {
				process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
			}
			
		} else {
			if (this.date && this.showType === true) {
				process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} | ${this._getFileCall()} | ${this._typeOfInput(info)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
			} else if (this.date && this.showType === false) {
				process.stdout.write(`[ ${this.name} | ${moment(new Date()).format(this.date)} ] - ${this._handleInputTypes(info)}${this.eol}`);	
			} else {
				console.log(`[ ${this.name} ] - ${this._handleInputTypes(info)}${this.eol}`);
			}
		}

		if (callback) {
			callback();
		}

		return;
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

		return strArray.reduce((set, el) =>  {
			if (typeof el !== 'string') {
				throw new Error(errMsg);
			}
			set[el] = true;

			return set;
		}, {});
	}

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
			return colors.bigint('Typeof Bigint');
		} else if (typeof input === 'boolean') {
			return colors.boolean('Typeof Boolean');
		} else if (typeof input === 'function') {
			return colors.function('Typeof Function');
		} else if (typeof input === 'number') {
			return colors.number('Typeof Number');
		} else if (typeof input === 'object') {
			return colors.object('Typeof Object');
		} else if (typeof input === 'string') {
			return colors.string('Typeof String');
		} else if (typeof input === 'symbol') {
			return colors.symbol('Typeof Symbol');
		} else if (typeof input === 'undefined') {
			return 'Typeof Undefined';
		} else {
			return undefined;
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
			return colors.bigint(input);
		} else if (typeof input === 'boolean') {
			return colors.boolean(input);
		} else if (typeof input === 'function') {
			return colors.function(`function ${input.name}() { native code }`);
		} else if (typeof input === 'number') {
			return colors.number(input.toString());
		} else if (typeof input === 'object') {
			return colors.object(JSON.stringify(input));
		} else if (typeof input === 'string') {
			return colors.string(input);
		} else if (typeof input === 'symbol') {
			return colors.symbol(input.toString());
		} else if (typeof input === 'undefined') {
			return undefined;
		} else {
			return undefined;
		}
	}
}