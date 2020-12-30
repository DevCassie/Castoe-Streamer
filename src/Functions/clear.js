/**
 * Core clear function
 * @param {GenericTransformStream} stream 
 */
module.exports = function clear(stream) {
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