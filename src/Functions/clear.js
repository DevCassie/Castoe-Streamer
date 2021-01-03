/**
 * Clears the console stream.
 * @param {GenericTransformStream} stream
 * @returns {Promise<void>}
 */
module.exports = function Clear(stream) {
	try {
		if (stream === process.stdout) {
			process.stdout.cursorTo(0,0);
			process.stdout.clearLine(0);
			process.stdout.clearScreenDown();
		}
	} catch (error) {
		throw Error;
	}
}