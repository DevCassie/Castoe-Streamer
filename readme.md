# Castoe Streamer

> Castoe Streamer is a customizable NodeJS stream handler package. It's original creation was to be able to write files for the official Castoe Discord bot. As an end result, I've also implemented methods to stream to a console output. 

# Main features
* Customizability is key
* Creating a `console` transport
* Creating `file` transport
* Loose Function support

# Usage

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

castoeConsole.send('This gets send to the console.');
```

# Bugs / Issues / Features
If you found a bug, or if you have any ideas to implement into Castoe Streamer, you could contact me on discord using the following tag `Cassie#8330`. You could also join the official support server [here](https://discord.gg/3BjWtjn), on the other hand you could also just support an issue on the [github repo](https://github.com/DevCassie/Castoe-Streamer/issues).

# Contributing
Castoe Streamer is licensed under the MIT license. Which means you are free to contribute to the package by forking the repository or cloning the master branch.