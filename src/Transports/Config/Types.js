'use strict';
const figures = require('figures');

module.exports = {
	error: {
		figure: figures.cross,
		label: 'error',
		level: 'error',
		color: 'red'
	},
	warn: {
		figure: figures.warning,
		label: 'warning',
		level: 'warn',
		color: 'yellow'
	},
	debug: {
		figure: figures.bullet,
		label: 'debug',
		level: 'debug',
		color: 'green'
	},
	info: {
		figure: figures.info,
		label: 'info',
		level: 'info',
		color: 'cyan'
	},
	send: {
		figure: figures.pointer,
		label: 'send',
		level: 'send',
		color: 'white'
	}
}