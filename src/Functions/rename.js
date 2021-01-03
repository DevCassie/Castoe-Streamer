const { rename } = require('fs');

/**
 * Core rename function.
 * @param {String} oldName - Which file needs to be renamed?
 * @param {String} newName - The new name of the file.
 * @returns {Promise<void>}
 * @exports
 */
module.exports = function Rename(oldName, newName) {
	try {
		rename(oldName, newName, (error) => {
			if (error) throw Error;

			console.log('Rename completed!');
		});
	} catch (error) {
		console.error(error);
	}
}