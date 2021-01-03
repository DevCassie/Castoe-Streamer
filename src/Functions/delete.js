const { unlink } = require('fs');

/**
 * Core delete function
 * @param {String} file - Which file needs to be deleted?
 * @returns {Promise<void>}
 * @exports
 */
module.exports = function Delete(file) {
	try {
		unlink(file, (error) => {
			if (error) throw Error;
		});
	} catch (error) {
		console.error(error);
	}
}