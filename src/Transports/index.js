// const CastoeConsole = require('./ConsoleTransport.js');
// const CastoeStream = require('./StreamTransport.js');
// const CastoeFile = require('./FileTransport.js');

module.exports = {
	CastoeFile: require('./FileTransport.js'),
	CastoeStream: require('./StreamTransport.js'),
	CastoeConsole: require('./ConsoleTransport.js'),
}