const fs = require('fs');

/**
 * Core clone function.
 * @param {String} oldFile - Which file needs to be cloned?
 * @param {String} newFile - Where does the backup file needs to be cloned?
 * @returns {Promise<void>}
 * @exports
 */
module.exports = function Clone(oldFile, newFile) {
	newFile = `Backup_${oldFile}`;

	fs.copyFile(oldFile, newFile, (error) => {
		if (error) {
			throw new Error('Error while cloning a file. %s', oldFile);
		}
	});
}