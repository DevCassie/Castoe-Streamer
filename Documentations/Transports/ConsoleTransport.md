## Main import
```JavaScript
const castoeStreamer = require('castoestreamer');
// Remaining code....
```

## Creating a new Console Transport
```JavaScript
const castoeStreamer = require('castoestreamer');
// Console transport.
const castoeConsole = new castoeStreamer.Transports.Console();
```

## Customizing the Console Transport
```JavaScript
const castoeStreamer = require('castoestreamer');
// Console transport.
const castoeConsole = new castoeStreamer.Transports.Console({
	name: 'Console Castoe',
	traceFile: true,
	date: 'LTS',
	colors: {
		bigint: 'green',
		boolean: 'yellow',
		function: 'blue',
		number: 'magenta',
		object: 'cyan',
		string: 'gray',
		symbol: 'red'
	}
});
```

### Colors
To customize the colors, there isn't a much customizability yet there but the colors that are able to be customized are based of the [colors package](https://www.npmjs.com/package/colors#text-colors).

## Using the Console Transport
```JavaScript
const castoeStreamer = require('castoestreamer');
// Console transport.
const castoeConsole = new castoeStreamer.Transports.Console({
	name: 'Console Castoe',
	traceFile: true
});

// Input will be send to the console
castoeConsole.send('This gets send to the console.');

// Expected output:
// This gets send to the console.

// Or to clear the console output. Simply do this:
castoeConsole.clear();
```