const { rename } = require('fs');

/**
 * Core delete method exposed to Castoe File Transport.
 * @param {String} file - Which file needs to be deleted?
 * @returns {undefined}
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