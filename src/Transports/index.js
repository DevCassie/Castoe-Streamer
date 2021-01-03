/**
 * Setup for exposing.
 * @type {Object}
 */
const castoe = exports;

castoe.CastoeConsole = require('./ConsoleTransport.js');
castoe.CastoeStream = require('./StreamTransport.js');
castoe.CastoeFile = require('./FileTransport.js');