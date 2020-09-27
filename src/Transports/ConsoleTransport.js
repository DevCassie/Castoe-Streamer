const os = require('os');
const { Transform } = require('stream'); 

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

		// Expose the name of this Transport on the prototype
		this.name = options.name || 'Castoe Console';
		this.stderrLevels = this._stringArrayToSet(options.stderrLevels);
		this.consoleWarnLevels = this._stringArrayToSet(options.consoleWarnLevels);
		this.eol = options.eol || os.EOL;

		this.setMaxListeners(30);
	}

	/**
	 * Core logging method exposed to Castoe Logger.
	 * @param {*} info - Input for the log.
	 * @param {*} callback - Callback function.
	 */
	send(info, callback) {
		setImmediate(() => this.emit('logged', info));

		if (this.stderrLevels[info]) {
			if (process.stderr) {
				process.stdout.write(`${info}${this.eol}`);
			} else {
				process.stderr.write(`${info}${this.eol}`);
			}

			if (callback) {
				callback();
			}
			return;
		} else if (this.consoleWarnLevels[info]) {
			if (process.stderr) {
				process.stdout.write(`${info}${this.eol}`);
			} else {
				process.stderr.write(`${info}${this.eol}`);
			}

			if (callback) {
				callback();
			}
			return;
		}

		if (process.stdout) {
			process.stdout.write(`${info}${this.eol}`);
		} else {
			console.log(`${info}${this.eol}`);
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
}