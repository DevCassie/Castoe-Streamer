## Main import
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Remaining code....
```

## Creating a new Console Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeConsole = new castoeStreamer.CastoeConsole();
```

## Customizing the Console Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeConsole = new castoeStreamer.CastoeConsole({
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
	},
  showType: true
});
```

### Colors
To customize the colors, there isn't a much customizability yet there but the colors that are able to be customized are based of the [colors package](https://www.npmjs.com/package/colors#text-colors).

## Using the Console Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeConsole = new castoeStreamer.CastoeConsole({
	name: 'Console Castoe',
	traceFile: true
});

// Input will be send to the console
castoeConsole.send('This gets send to the console.');

// Expected output:
[ Castoe Console | 8:54:14 PM | Logger.js:10 | Typeof Object ]    
This gets send to the console

// Or to clear the console output. Simply do this:
castoeConsole.clear();
```