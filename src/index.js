/* eslint-disable no-unused-vars */
const CastoeFile = require('./Transports/FileTransport.js');
const CastoeStream = require('./Transports/StreamTransport.js');
const CastoeConsole = require('./Transports/ConsoleTransport.js');

/**
 * @type {CastoeFile}
 */
module.exports.CastoeFile = require('./Transports/FileTransport');
/**
 * @type {CastoeStream}
 */
module.exports.CastoeStream = require('./Transports/StreamTransport');
/**
 * @type {CastoeConsole}
 */
module.exports.CastoeConsole = require('./Transports/ConsoleTransport');
/**
 * Exposes version.
 * @type {String}
 */
module.exports.version = require('../package.json').version;
/**
 * Exposes the name of the creator.
 * @type {String}
 */
module.exports.author = require('../package.json').author;
/**
 * @type {Function}
 */
module.exports.Clear = require('./Functions/index').Clear;
/**
 * @type {Function}
 */
module.exports.Clone = require('./Functions/index').Clone;
/**
 * @type {Function}
 */
module.exports.Delete = require('./Functions/index').Delete;
/**
 * @type {Function}
 */
module.exports.Rename = require('./Functions/index').Rename;