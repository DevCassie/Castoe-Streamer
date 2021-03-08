const os = require('os');
const util = require('util');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const figures = require('figures');
const { Transform } = require('stream');
const types = require('./Config/Types.js');
const { grey } = chalk;

/**
 * @typedef CastoeConsoleOptions
 * @property {String?} [name=''] Name of the console.
 * @property {String?} [date=''] Format for the date.
 * @property {Boolean?} [traceFile=false] Wether or not the console should return the file it's called from.
 * @property {Boolean?} [showType=false] Should the output show which type the input is?
 * @property {Boolean?} [showBadge=true]
 * @property {Boolean?} [showLevel=true]
 */

/**
 * @type {Console}
 * @extends {Transform}
 * @example new castoeStreamer.CastoeConsole({ traceFile: true, colors: {error: 'red', debug: 'green', info: 'blue', warn: 'yellow', send: 'white'}, date: 'LTS', showType: true });
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
		/**
		 * @type {String}
		 */
		this.name = options.name || '';
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
		 * @type {Boolean}
		 */
		this.showLevel = options.showLevel;
		/**
		 * @type {Boolean}
		 */
		this.showBadge = options.showBadge;
		this._types = types;
		this._generalLevel = this._validateLevel(options.level);
		this.stackIndex = options.stackIndex || 3;
		this.eol = options.eol || os.EOL;
		this.setMaxListeners(30);

		Object.keys(this._types).forEach(type => {
			this[type] = this._logger.bind(this, type);
		});
	}

	_getNow() {
		return Date.now();
	}

	// eslint-disable-next-line getter-return
	_getFile() {
		const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
		const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
		const stackList = new Error().stack.split('\n').slice(3);
		const s = stackList[this.stackIndex];
		let sp = stackReg.exec(s);
		const data = {};
		if (sp === null) {
			sp = stackReg2.exec(s);
		}

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

	_getName() {
		return this.name;
	}

	_getLogLevels() {
		return {
			0: 'send',
			1: 'info',
			2: 'debug',
			3: 'warn',
			4: 'error'
		};
	}

	_formatStream(stream) {
		return this._transformToArray(stream);	
	}

	_formatDate() {
		return `[${moment(this._getNow()).format(this.date)}]`	
	}

	_formatFileName() {
		return `[${this._getFile()}]`;	
	}

	_formatName() {
		return `[${this._getName()}]`;
	}

	_formatMessage(string) {
		return util.formatWithOptions({ colors: true, showHidden: false, depth: string.length }, ...this._transformToArray(string));
	}

	_meta() {
		const meta = [];

		if (this.name) meta.push(this._formatName());
		if (this.traceFile && this.traceFile === true) meta.push(this._formatFileName());
		if (this.date) meta.push(this._formatDate());

		if (meta.length !== 0) {
			meta.push(`${figures.pointerSmall}`);
			return meta.map(item => grey(item));
		}

		return meta;
	}

	_hasAdditional({suffix, prefix}, args) {
		return (suffix || prefix) ? '' : this._formatMessage(args);
	}

	_buildConsole(type, ...args) {
		let [msg, additional] = [{}, {}];
		if (args.length === 1 && typeof (args[0]) === 'object' && args[0] !== null) {
			if (args[0] instanceof Error) {
				[msg] = args;
			} else {
				const [{prefix, message, suffix}] = args;
				additional = Object.assign({}, {suffix, prefix});
				msg = message ? this._formatMessage(message) : this._hasAdditional(additional, args);
			}
		} else {
			msg = this._formatMessage(args);
		}

		const meta = this._meta();
		if (additional.prefix) meta.push(additional.prefix);
		if (this.showBadge === true && type.figure) meta.push(chalk[type.color](this._padEnd(type.figure, type.figure.length + 1)));
		if (this.showLevel === true && type.label) meta.push(chalk[type.color](this._padEnd(type.label, type.label.length + 1)));
		if (msg && msg !== null) meta.push(msg);
		if (additional.suffix) meta.push(additional.suffix);
		return meta.join(' ');
	}

	_validateLevel(level) {
		return Object.keys(this._getLogLevels()).includes(level) ? level : 'send';
	}

	_transformToArray(input) {
		return Array.isArray(input) ? input : [input];
	}

	_write(stream, message) {
		if (!stream) throw new Error('Stream must be given.');
		if (stream !== process.stdout) throw new Error('Stream must be off process.stdout.');
		stream.write(`${message}${this.eol}`);
	}

	_log(message, stream = process.stdout, level) {
		if (this._getLogLevels[level] == this._getLogLevels[this._generalLevel]) {
			this._write(stream, message);
		}	
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

	_logger(type, ...messageObject) {
		const { stream, level } = this._types[type];
		const message = this._buildConsole(this._types[type], ...messageObject);
		this._log(message, stream, this._validateLevel(level));
	}

	_padEnd(string, targetLength) {
		string = String(string);
		targetLength = parseInt(targetLength, 10) || 0;

		if (string.length >= targetLength) {
			return string;
		}

		if (String.prototype.padEnd) {
			return string.padEnd(targetLength);
		}

		targetLength -= string.length;
		return string + ' '.repeat(targetLength);
	}
}