const fs = require('fs');

/**
 * Core clone method exposed to Castoe File Transport.
 * @param {String} file - Which file needs to be cloned?
 * @param {String} destination - Where does the backup file needs to be cloned?
 * @returns {undefined}
 */
module.exports = function clone(file, destination) {
	destination = `Backup_${file}`;

	fs.copyFile(file, destination, (error) => {
		if (error) {
			throw new Error('Error while cloning a file. %s', file);
		}
	});
}