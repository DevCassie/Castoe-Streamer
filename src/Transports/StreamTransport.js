const isStream = require('is-stream');
const os = require('os');
const { Transform, Stream } = require('stream');

/**
 * @typedef CastoeStreamOptions
 * @property {Stream} [stream]
 */

module.exports = class CastoeStream extends Transform {
	/**
   	* Constructor function for the Console transport object responsible for
   	* persisting log messages and metadata to a terminal or TTY.
   	* @param {CastoeStreamOptions} [options] - Options for this instance.
   	*/
	constructor(options = {} ) {
		super(options);

		if (!options.stream || !isStream(options.stream)) {
			throw new Error('options.stream is required and should be a valuable stream source.');
		}

		this._stream = options.stream;
		this._stream.setMaxListeners(Infinity);
		this.isObjectMode = options.stream._writableState.objectMode;
		this.eol = options.eol || os.EOL;
	} 

	/**
	 * Core logging method exposed to Castoe Logger.
	 * @param {Object} info - What should be logged to the log?
	 * @param {Function} callback - Callback function.
	 * @returns {undefined}
	 */
	send(info, callback) {
		setImmediate(() => this.emit('logged', info));

		if (this.isObjectMode) {
			this._stream.write(info);

			if (callback) {
				callback();
			}

			return;
		}

		this._stream.write(`${info}${this.eol}`);
		if (callback) {
			callback();
		}
		
		return;
	}
}