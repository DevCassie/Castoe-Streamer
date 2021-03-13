/* eslint-disable no-empty-function */
const os = require('os');
// eslint-disable-next-line no-unused-vars
const { Transform, Stream } = require('stream'); 
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

/**
 * @typedef CastoeFileOptions
 * @property {String?} [file]
 * @property {String?} [dirname]
 * @property {Boolean?} [automatic]
 * @property {Boolean?} [overwrite]
 * @property {CastoeWriteStreamOptions?} [options] 
 * @exports
 */

/**
 * @typedef CastoeWriteStreamOptions
 * @property {string} [flags]
 * @property {BufferEncoding} [encoding]
 * @property {number} [fd]
 * @property {number} [mode]
 * @property {boolean} [autoClose]
 * @property {boolean} [emitCLose]
 * @property {number} [start]
 * @property {number} [end]
 * @property {number} [highWaterMark]
 */

module.exports = class CastoeFile extends Transform {
	/**
	 * Construction function for the File transport. Responsable for writing to files.
	 * @param {CastoeFileOptions} options 
	 */
	constructor(options) {
		super(options);
		this.file = options.file;
		if (options.file || options.dirname) {
			this._basename = this.file = options.file ? path.basename(options.file) : 'castoeFile.txt';
			this.dirname = path.dirname(options.file);
		}
		/**
		 * @type {Object}
		 */
		this.options = options.options || { flags: 'a+', encoding: 'utf-8' };
		/**
		 * @type {Number}
		 */
		this.eol = options.eol || os.EOL;
		/**
		 * @type {Boolean}
		 */
		this.automatic = options.automatic || false;		
		/**
		 * @type {Boolean}
		 */
		this.overwrite = options.overwrite || false;
	}

	/**
	 * Method to send data to the file.
	 * @param {String} input 
	 */
	send(input) {
		const outputStream = this._createStream();
		outputStream.writeStream.write(`${input}\n`);

		outputStream.writeStream
			.on('error', (error) => console.error(error))
			.on('close', () => console.log('Filestream closed.'))
			.on('open', () => {
				const target = this._getFile();
				if (this.automatic === true) {
					this._automatedBackup(target);
				}
			});
	}

	/**
	 * Method to read the file.
	 * @param {Function} callback 
	 * @returns {Promise<void>}
	 */
	read(callback = () => {}) {
		const chunks = [];
		const stream = this._createStream();
		stream.readStream
			.on('data', (buffer) => {
				chunks.push(buffer);
			})
			.on('end', () => {
				const buffer = Buffer.concat(chunks);
				const decodedBuffer = buffer.toString(this.options.encoding);
				callback(decodedBuffer);
			});
	}

	/**
	 * Clone method exposed to this instance.
	 * @param {String} cloneFile - Where does the backup file needs to be cloned?
	 * @example castoeFile.clone('cloneFile');
	 * @returns {Promise<void>}
	 */
	clone(cloneFile) {
		const file = this._getFile();
		cloneFile = `Clone_${file}`;

		fs.copyFile(file, cloneFile, (error) => {
			if (error) return console.error('Error while cloning a file. %s', file);
		});
	}

	/**
	 * Delete Method exposed to this instance.
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
		});
	}

	/**
	 * Returns the Writeable & Readable stream for the active file on this instance.
	 * @returns {Transform}
	 */
	_createStream() {
		const fullpath = path.join(this.dirname, this.file);
		const stream = Transform;
		stream.writeStream = fs.createWriteStream(fullpath, this.options);
		if (fullpath) {
			stream.readStream = fs.createReadStream(fullpath);
		}

		return stream;
	}

	/**
	 * Gets the next file to use for this instance in the case that log filesizes are being capped.
	 * @returns {String}
	 * @private
	 */
	_getFile() {
		const ext = path.extname(this.file);
		const basename = path.basename(this._basename, ext);
		const target = `${basename}${ext}`;
		return target;
	}

	/**
	 * Creates the dir path of the files.
	 * @param {String} dirPath 
	 * @private
	 */
	_createDirIfNotExists(dirPath) {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}

	/**
	 * Private method to include automated backups if turned on.
	 * @private
	 */
	_automatedBackup(file) {
		const fullpath = path.join(this.dirname, file);

		fs.access(fullpath, (error) => {
			if (error) return console.error(`Error while creating a new backup.\n${fullpath}`);

			const newPath = path.join('Backups/');
			this._createDirIfNotExists(newPath);

			let newFileLocation = `${newPath}Backup_${file}`;
			if (!fs.existsSync(newFileLocation)) {
				if (this.overwrite === false) {
					fs.copyFileSync(fullpath, newFileLocation);
				} else {
					fs.readdir(newPath, (error, files) => {
						if (error) throw new Error;
						for (let i = 0; i < files.length; i++) {
							newFileLocation = `${newPath}${i}_Backup_${file}`;

							fs.copyFileSync(file, newFileLocation);
						}
					});
				}
			} else {
				if (this.overwrite === false) {
					fs.copyFileSync(file, newFileLocation);
				} else {
					fs.readdir(newPath, (error, files) => {
						if (error) throw new Error;
						for (let i = 0; i < files.length; i++) {
							newFileLocation = `${newPath}${i}_Backup_${file}`;

							fs.copyFileSync(file, newFileLocation);
						}
					});
				}	
			}
		});
	}

	createGzip() {
		const gzip = zlib.createGzip();
		const readFile = fs.createReadStream(this.file);
		const writeFile = fs.createWriteStream(`${this.file}.gz`);
		if (!readFile) {
			throw new Error('File does not exists.');		
		}
		return readFile.pipe(gzip).pipe(writeFile);
	}
}