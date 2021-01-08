/* eslint-disable no-empty-function */
const os = require('os');
const { Transform, PassThrough, Stream } = require('stream'); 
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const asyncSeries = require('async-series');

const tailFile = require('../lib/tailFile.js');

/**
 * @typedef CastoeFileOptions
 * @property {String?} [file]
 * @property {String?} [dirname]
 * @property {Boolean?} [automatic]
 * @property {Number?} [maxFiles]
 * @property {Boolean?} [overwrite]
 * @property {Object?} [options] 
 * @exports
 */

module.exports = class CastoeFile extends Transform {
	/**
	 * Construction function for the File transport. Responsable for writing to files.
	 * @param {CastoeFileOptions} options 
	 */
	constructor(options) {
		super(options);

		this._stream = new PassThrough();
		this._stream.setMaxListeners(30);

		this._onError = this._onError.bind(this);

		if (options.file || options.dirname) {
			this._basename = this.file = options.file ? path.basename(options.file) : 'castoe.log';

			/**
		 * @type {String}
		 * @exports
		 */
			this.dirname = options.dirname || path.dirname(options.file);
			/**
		 * @type {Object}
		 * @exports
		 */
			this.options = options.options || { flags: 'a' };
		}

		this.maxFiles = options.maxFiles || null;
		this.eol = options.eol || os.EOL;
		/**
		 * @type {Boolean}
		 */
		this.automatic = options.automatic || false;		
		/**
		 * @type {Boolean}
		 */
		this.overwrite = options.overwrite || false;

		this._size = 0;
		this._pendingSize = 0;
		this._created = 0;
		this._drain = false;
		this._opening = false;
		this._ending = false;

		if (this.dirname) this._createLogDirIfNotExists(this.dirname);
		this.open();
	}

	finishifEnding() {
		if (this._ending) {
			if (this._opening) {
				this.once('open', () => {
					this._stream.once('finish', () => this.emit('finish'));
					setImmediate(() => this._stream.end());
				});
			} else {
				this._stream.once('finish', () => this.emit('finish'));
				setImmediate(() => this._stream.end());
			}
		}
	}

	/**
	 * Returns a log stream for this transport.
	 * @param {Object?} options - Stream options for this instance.
	 * @returns {Stream}
	 * @private
	 */
	stream(options = {}) {
		const file = path.join(this.dirname, this.file);
		const stream = new Stream();
		const tail = {
			file,
			start: options.start
		};

		stream.destroy = tailFile(tail, (error, line) => {
			if (error) return stream.emit('error', error);

			try {
				stream.emit('data', line);
				line = JSON.parse(line);
				stream.emit('send', line);
			} catch (error) {
				stream.emit('error', error);
			}
		});

		return stream;
	}

	/**
	 * @returns {undefined}
	 * @private
	 */
	open() {
		if (!this.file) return;
		if (this._opening) return;

		this._opening = true;
	}
}