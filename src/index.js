/* eslint-disable no-unused-vars */
const CastoeFile = require('./Transports/FileTransport.js');
const CastoeStream = require('./Transports/StreamTransport.js');
const CastoeConsole = require('./Transports/ConsoleTransport.js');

/**
 * Setup for exposing.
 * @type {Object}
 */
const castoe = exports;

/**
 * @type {CastoeFile}
 */
castoe.CastoeFile = require('./Transports/FileTransport.js');
/**
 * @type {CastoeStream}
 */
castoe.CastoeStream = require('./Transports/StreamTransport.js');
/**
 * @type {CastoeConsole}
 */
castoe.CastoeConsole = require('./Transports/ConsoleTransport.js');
/**
 * Exposes version.
 * @type {String}
 */
castoe.version = require('../package.json').version;
/**
 * Exposes the name of the creator.
 * @type {String}
 */
castoe.author = require('../package.json').author;
/**
 * @type {Function}
 */
castoe.Functions = require('./Functions/index.js');