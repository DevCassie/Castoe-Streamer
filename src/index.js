/**
 * Setup for exposing.
 * @type {Object}
 */
const castoe = exports;

/**
 * @type {GenericTransformStream}
 */
castoe.Transports = require('./Transports/');
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
castoe.Functions = require('./Functions/');