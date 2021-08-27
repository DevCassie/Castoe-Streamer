// eslint-disable-next-line no-unused-vars
const { Stream } = require('stream');

/**
 * Clears the console stream.
 * @param {Stream} stream
 * @returns {Promise<void>}
 */
module.exports = function Clear(stream) {
	if (stream !== process.stdout) throw new Error('Stream must be process.stdout');

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