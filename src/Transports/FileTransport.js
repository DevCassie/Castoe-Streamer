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
 * @property {String?} [name]
 * @property {String?} [file]
 * @property {String?} [dirname]
 * @property {Number?} [maxsize]
 * @property {Boolean?} [zippedArchive]
 * @property {Boolean?} [automatic]
 * @property {Number?} [maxFiles]
 * @property {Boolean?} [overwrite]
 */

/**
 * @type {File}
 * @extends {Transform}
 */
module.exports = class CastoeFile extends Transform {
	/**
   * Constructor function for the Console transport object responsible for
   * persisting log messages and metadata to a terminal or TTY.
   * @param {!Object} [options={}] - Options for this instance.
   */	
	constructor(options = {}) {
		super(options);

		// Expose the name of this Transport on the prototype
		/**
		 * @type {String}
		 */
		this.name = options.name || 'Castoe File';

		/* Helper function which throws an Error in the event that any of the rest of the arguments is present in options. */
		function throwIf(target, ...args) {
			args.slice(1).forEach(name => {
				if (options[name]) {
					throw new Error(`Can't set ${name} and ${target} together.`);
				}
			})
		}

		// Base stream that always gets piped to handle buffering.
		this._stream = new PassThrough();
		this._stream.setMaxListeners(30);

		// Bind context for listener methods.
		this._onError = this._onError.bind(this);

		if (options.file || options.dirname) {
			throwIf('file or dirname', 'stream');
			this._basename = this.file = options.file ? path.basename(options.file) : 'castoe.log';

			/**
			 * @type {String}
			 */
			this.dirname = options.dirname || path.dirname(options.file);
			/**
			 * @type {Object}
			 */
			this.options = options.options || { flags: 'a' };
		} else if (options.stream) {
			throwIf('stream', 'file', 'maxsize');
			this._dest = this._stream.pipe(this._setupStream(options.stream));
			this.dirname = path.dirname(this._dest.path);

			/* We need to listen for drain events when write() returns false. */
		} else {
			throw new Error('Can\'t log to file without a file or stream.');
		}

		/**
		 * @type {Number}
		 */
		this.maxsize = options.maxsize || null;
		/**
		 * @type {Boolean}
		 */
		this.rotationFormat = options.rotationFormat || false;
		/**
		 * @type {Boolean}
		 */
		this.zippedArchive = options.zippedArchive || false;
		/**
		 * @type {Number}
		 */
		this.maxFiles = options.maxFiles || null;
		this.eol = options.eol || os.EOL;
		/**
		 * @type {Boolean}
		 */
		this.tailable = options.tailable || false;
		/**
		 * @type {Boolean}
		 */
		this.automatic = options.automatic || false;
		/**
		 * @type {Boolean}
		 */
		this.overwrite = options.overwrite || false;

		/* Internal state variables representing the number of files this instance has created and the current size in bytes of the current log file. */
		this._size = 0;
		this._pendingSize = 0;
		this._created = 0;
		this._drain = false;
		this._opening = false;
		this._ending = false;

		if (this.dirname) this._createLogDirIfNotExists(this.dirname);
		this.open();
	}

	finishIfEnding() {
		if (this._ending) {
			if (this._opening) {
				this.once('open', () => {
					this._stream.once('finish', () => this.emit('finish'));
					setImmediate(() => this._stream.end());
				})
			} else {
				this._stream.once('finish', () => this.emit('finish'));
				setImmediate(() => this._stream.end());
			}
		}
	}

	/**
	 * Core logging method exposed to Castoe Logger.
	 * @param {*} info - Input for the log.
	 * @param {Function} callback - Callback function.
	 * @returns {Promise<void>}
	 */
	send(info, callback = () => {}) {
		if (this.silent) {
			callback();
			return true;
		}

		/* Output stream buffer is full and has asked us to wait for the drain event. */
		if (this._drain) {
			this._stream.once('drain', () => {
				this._drain = false;
				this.send(info, callback);
			});
			return;
		}

		if (this._rotate) {
			this._stream.once('rotate', () => {
				this._rotate = false;
				this.send(info, callback);
			});
			return;
		}

		/* Grab the new raw string and append the expected EOL. */
		const output = `${info}${this.eol}`;
		const bytes = Buffer.byteLength(output);

		/* After we have written to the PassThrough check to see if we need to rotate to the next file. */
		function logged() {
			this._size += bytes;
			this._pendingSize -= bytes;

			this.emit('logged', info);

			/* Do not attempt to rotate files while opening. */
			if (this._opening) {
				return;
			}

			/* Check to see if we need to end the stream and create a new one. */
			if (!this._needsNewFile()) {
				return;
			}

			/* End the current stream to ensure it flushed and creates a new one. This could potentially be optimized to not run a stat call but its the safest way since we are supporting maxFiles. */
			this._rotate = true;
			this._endStream(() => this._rotateFile());
		}

		/* Keep track of the pending bytes being written while files are opening in order to properly rotate the PassThrough this._stream when the file eventually does open. */
		this._pendingSize += bytes;
		if (this._opening && !this.rotatedWhileOpening && this._needsNewFile(this.size + this._pendingSize)) {
			this.rotatedWhileOpening = true;
		}

		const written = this._stream.write(output, logged.bind(this));

		if (!written) {
			this._drain = true;
			this._stream.once('drain', () => {
				this._drain = false;
				callback();
			});
		} else {
			callback();
		}

		this.finishIfEnding();

		return written;
	}

	/**
	 * Returns a log stream for this transport. Options object is optional.
	 * @param {Object} options - Stream options for this instance.
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
			if (error) {
				return stream.emit('error', error);
			}

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
	 * Checks to see the filesize.
	 * @returns {undefined}
	 * @private
	 */
	open() {
		/* If we don't have a file then we were passed a stream and don't need to keep track of size. */
		if (!this.file) return;
		if (this._opening) return;

		this._opening = true;

		/* Stat the target file to get the size and create the stream. */
		this.stat((error, size) => {
			if (error) {
				return this.emit('error'. error);
			}

			console.debug('Statistics done: %S { size: %s }', this.file, size);
			this._size = size;
			this._dest = this._createStream(this._stream);
			this._opening = false;
			this.once('open', () => {
				if (this._stream.eventNames().includes('rotate')) {
					this._stream.emit('rotate');
				} else {
					this._rotate = false;
				}
			});
		});
	}

	/**
	 * Stat the file and assess information in order to create the proper stream.
	 * @param {*} callback 
	 * @returns {undefined}
	 * @private
	 */
	stat(callback) {
		const target = this._getFile();
		const fullpath = path.join(this.dirname, target);

		fs.stat(fullpath, (error, stat) => {
			if (error && error.code === 'ENOENT') {
				console.error('ENOENT succes on', fullpath);
				/* Update internally tracked file with the new target name. */
				this.file = target;
				return callback(null, 0);
			}

			if (error) {
				console.error(`Error: ${error.code} ${fullpath}`);
				return callback(error);
			}

			if (!stat || this._needsNewFile(stat.size)) {
				/* If stats.size is greater than the maxsize for this instance, then try again. */
				return this._incFile(() => this.stat(callback));
			}

			/* Once we have figured out what the file is. Set it and return the size. */
			this.file = target;
			callback(null, stat.size);
		});
	}

	/**
	 * Closes the stream associated with this instance.
	 * @param {Function} callback 
	 * @returns {undefined}
	 * @private
	 */
	close(callback) {
		if (!this._stream) {
			return;
		}

		this._stream.end(() => {
			if (callback) {
				callback();
			}
			this.emit('flush');
			this.emit('closed');
		});
	}

	/**
	 * Check if a new file needs to be created.
	 * @param {number} size 
	 * @returns {undefined}
	 * @private
	 */
	_needsNewFile(size) {
		size = size || this._size;
		return this.maxsize && size >= this.maxsize;
	}

	/**
	 * Emits the error event.
	 * @param {Error} error
	 * @returns {undefined}
	 * @private
	 */
	_onError(error) {
		this.emit('error', error);
	}

	/**
	 * Set's up the stream, and checks if the stream gets an error.
	 * @param {*} stream 
	 * @returns {mixed}
	 */
	_setupStream(stream) {
		stream.on('error', this._onError);
	}

	/**
	 * Cleans the stream.
	 * @param {*} stream
	 * @returns {mixed}
	 */
	_cleanupStream(stream) {
		stream.removeListener('error', this._onError);
		return stream;	
	}

	/**
	 * Rotates file.
	 */
	_rotateFile() {
		this._incFile(() => this.open());
	}

	/**
	 * Unpipe from the stream that has been marked as full and end it so it flushed to disk.
	 * @param {Function} callback - Callback for when the current file has closed.
	 * @private
	 */
	_endStream(callback = () => {}) {
		if (this._dest) {
			this._stream.unpipe(this._dest);
			this._dest.end(() => {
				this._cleanupStream(this._dest);
				callback();
			});
		} else {
			callback();
		}
	}

	/**
	 * Returns the WriteableStream for the active file on this instance. If we should gzip the file a zlib stream is returned.
	 * @param {ReadableStream} source - PassThrough to pipe to the file when open.
	 * @returns {WritableStream} Stream that writes to disk for active file.
	 */
	_createStream(source) {
		const fullpath = path.join(this.dirname, this.file);

		const dest = fs.createWriteStream(fullpath, this.options)
			.on('error', err => console.error(err))
			.on('close', () => console.debug('FileStream closed.', dest.path, dest.bytesWritten))
			.on('open', () => {
				console.debug('File opened.', fullpath);
				this.emit('open', fullpath);
				source.pipe(dest);

				if (this.automatic) {
					this._automatedBackup(fullpath);
				}

				/* If rotation occured during the open operation then we immediatly start writing to a new PassThrough, begin opening the next file. Cleanup the previous source and dest once the source has drained. */
				if (this.rotatedWhileOpening) {
					this._stream = new PassThrough();
					this._stream.setMaxListeners(30);
					this._rotateFile();
					this.rotatedWhileOpening = false;
					this._cleanupStream(dest);
					source.end();
				}
			});

		if (this.zippedArchive) {
			const gzip = zlib.createGzip();
			gzip.pipe(dest);
			return gzip;
		}

		return dest;
	}

	/**
	 * 
	 * @param {Function} callback
	 * @returns {undefined}
	 */
	_incFile(callback) {
		const ext = path.extname(this._basename);
		const basename = path.basename(this._basename, ext);

		if (!this.tailable) {
			this._created += 1;
			this._checkMaxFilesIncrementing(ext, basename, callback);
		} else {
			this._checkMaxFilesTailable(ext, basename, callback);
		}
	}

	/**
	 * Gets the next file to use for this instance in the case that log filesizes are being capped.
	 * @returns {String}
	 * @private
	 */
	_getFile() {
		const ext = path.extname(this._basename);
		const basename = path.basename(this._basename, ext);
		const isRotation = this.rotationFormat ? this.rotationFormat() : this._created;

		const target = !this.tailable && this._created ? `${basename}${isRotation}${ext}` : `${basename}${ext}`;

		return this.zippedArchive && !this.tailable ? `${target}.gz` : target;
	}

	/**
	 * Increment the number of files created or checked by this instance.
	 * @param {mixed} ext - 
	 * @param {mixed} basename - 
	 * @param {mixed} callback -
	 * @returns {undefined}
	 * @private
	 */
	_checkMaxFilesIncrementing(ext, basename, callback) {
		/* Check for maxFiles option and delete file. */
		if (!this.maxFiles || this._created < this.maxFiles) {
			return setImmediate(callback);
		}

		const oldest = this._created - this.maxFiles;
		const isOldest = oldest !== 0 ? oldest : '';
		const isZipped = this.zippedArchive ? '.gz' : '';
		const filePath = `${basename}${isOldest}${ext}${isZipped}`;
		const target = path.join(this.dirname, filePath);

		fs.unlink(target, callback);
	}

	/**
	 * Roll files forward based on integer. Up to maxFiles. For example if file.log becomes oversized, roll to file1.log and allow file.log to be re-used.
	 * @param {mixed} ext 
	 * @param {mixed} basename 
	 * @param {mixed} callback 
	 * @returns {undefined}
	 * @private
	 */
	_checkMaxFilesTailable(ext, basename, callback) {
		const tasks = [];
		if (!this.maxFiles) {
			return;
		}

		const isZipped = this.zippedArchive ? '.gz' : '';
		for (let x = this.maxFiles - 1; x > 1; x--) {
			tasks.push(function(index, callback) {
				let file = `${basename}${index -1}${ext}${isZipped}`;
				const tmppath = path.join(this.dirname, file);

				fs.existsSync(tmppath, exists => {
					if (!exists) {
						return callback(null);
					}

					file = `${basename}${index}${ext}${isZipped}`;
					fs.rename(tmppath, path.join(this.dirname, file), callback);
				});
			}.bind(this, x));
		}

		asyncSeries(tasks, () => {
			fs.rename(
				path.join(this.dirname, `${basename}${ext}`),
				path.join(this.dirname, `${basename}1${ext}${isZipped}`),
				callback
			);
		});
	}

	_createLogDirIfNotExists(dirPath) {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}

	/**
	 * Core delete method exposed to Castoe File Transport.
	 * @example castoeFile.delete();
	 * @returns {Promise<void>}
	 */
	delete() {
		const target = this._getFile();
		const fullpath = path.join(this.dirname, target);

		fs.access(fullpath, (err) => {
			if (err) return console.error(err);
			fs.unlink(fullpath, (error) => {
				if (error) {
					console.error('Error while unlinking file %s', fullpath);	
				}
			});
		})
	}

	/**
	 * Private method to convert a file to a backup file.
	 * @param {String} file - Which file should be backed up?
	 * @returns {Promise<void>}
	 * @private
	 */
	_automatedBackup(file) {
		const fullpath = path.join(this.dirname, file);

		fs.access(fullpath, (error) => {
			if (error) return console.error('Error while creating an automated backup. %s', fullpath);


			const newPath = path.join(this.dirname, 'Backups/');
			if (!fs.existsSync(newPath)) {
				fs.mkdirSync(newPath);
			}

			let newFileLocation = `${newPath}Backup_${file}`;
			if (!fs.existsSync(newFileLocation)) {
				if (this.overwrite) {
					fs.copyFileSync(file, newFileLocation);
				} else {
					fs.readdir(newPath, (err, files) => {
						if (err) throw new Error;
						for (let i = 0; i < files.length; i++) {
							newFileLocation = `${newPath}Backup_${i}_${file}`;

							fs.copyFileSync(file, newFileLocation);
						}
					});
				}
			} else {
				if (this.overwrite) {
					fs.copyFileSync(file, newFileLocation);
				} else {
					fs.readdir(newPath, (err, files) => {
						if (err) throw new Error;
						for (let i = 0; i < files.length; i++) {
							newFileLocation = `${newPath}Backup_${i}_${file}`;

							fs.copyFileSync(file, newFileLocation);
						}
					});
				}
			}
		});
	}

	/**
	 * Core clone method exposed to Castoe File Transport.
	 * @param {String} file - Which file needs to be cloned?
	 * @param {String} cloneFile - Where does the backup file needs to be cloned?
	 * @example castoeFile.clone(file, cloneFile);
	 * @returns {Promise<void>}
	 */
	clone(file, cloneFile) {
		cloneFile = `Backup_${file}`;

		fs.copyFile(file, cloneFile, (error) => {
			if (error) return console.error('Error while cloning a file. %s', file);
		});
	}
}