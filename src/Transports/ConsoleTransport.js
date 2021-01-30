const os = require('os');
const path = require('path');
const moment = require('moment');
const { Transform } = require('stream');
const colors = require('colors/safe');

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
 * @property {String} [bigint='green'] Which color for the bigint type?
 * @property {String} [boolean='cyan'] Which color for the boolean type?
 * @property {String} [function='magenta'] Which color for the function type?
 * @property {String} [number='blue'] Which color for the number type?
 * @property {String} [object='yellow'] Which color for the object type?
 * @property {String} [string='white'] Which color for the string type?
 * @property {String} [symbol='gray'] Which color for the symbol type?
 */

/**
 * @type {Console}
 * @extends {Transform}
 * @example new Transports.Console({ traceFile: true, colors: {bigint: 'green', boolean: 'cyan', function: 'magenta', number: 'blue', object: 'yellow', string: 'white', symbol: 'gray', date: 'LTS', showType: true}});
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
		this.stackIndex = options.stackIndex || 2;
		this.stderrLevels = this._stringArrayToSet(options.stderrLevels);
		this.consoleWarnLevels = this._stringArrayToSet(options.consoleWarnLevels);
		this.eol = options.eol || os.EOL;

		this.setMaxListeners(30);
		/**
		 * @type {CastoeConsoleColorOptions} 
		 */
		this.colors = options.colors;

		this.levels = [ 'info', 'debug', 'warn', 'error' ];
		for (const level of this.levels) {
			if (this[level] === 'error') {
				this[level] = function(info, name, callback) {
					return this.write(info, name, callback);
				}
			} else {
				this[level] = function(info, callback) {
					return this.write(info, callback)
				}
			}
		}

		if (this.colors) {
			if (options.colors.bigint && options.colors.boolean && options.colors.function && options.colors.number && options.colors.object && options.colors.string && options.colors.symbol) {
				colors.setTheme({
					bigint: options.colors.bigint,
					boolean: options.colors.boolean,
					function: options.colors.function,
					number: options.colors.number,
					object: options.colors.object,
					string: options.colors.string,
					symbol: options.colors.symbol
				});
			} else {
				throw new Error('options.colors needs to be an Object like this:\n{bigint: String, boolean: String, function: String, number: String, object: String,symbol: String}');
			}

		} else {
			options.colors = colors.setTheme({
				bigint: 'green',
				boolean: 'magenta',
				function: 'cyan',
				number: 'yellow',
				object: 'blue',
				string: 'white',
				symbol: 'gray'
			});
		}
	}

	/**
	 * Core logging method exposed to Castoe Console Logger.
	 * @param {*} info - Input for the log.
	 * @param {Function?} callback - Callback function.
	 * @returns {undefined}
	 */
	// eslint-disable-next-line no-empty-function
	send(info) {
		this.write(info);
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
			const Objectarray = [];
			Objectarray.push(input);
			return colors.object(Objectarray);
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
				return `[ ${this.name} | ${this._getFileCall()} ]\n[${name}]: `;
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
			} else {
				process.stdout.write(`${this._handleOptions(input)} ${this._handleInputTypes(input)}${this.eol}`);
			}
		} else {
			if (name) {
				console.log(`${this._handleOptions(input, name)}${this._handleInputTypes(input)}${this.eol}`);
			} else {
				console.log(`${this._handleOptions(input)} ${this._handleInputTypes(input)}${this.eol}`);
			}
		}

		if (callback) {
			callback();
		}
		return;
	}
}