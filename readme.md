# Castoe Streamer

> Castoe Streamer is a package that allows customizability and easy to use data transport between streams. Mostly a console transport or a file transport. However for those who desire a different stream transport there is the CastoeStream. It's original creation was to be able to write files for the official Castoe Discord bot. As an end result, I've also implemented methods to stream to a console output or a stream.

# Main features
* Customizability is key
* Creating a `console` transport
* Creating `file` transport
* Loose Function support

# Usage

## Main import
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Remaining code....
```

## Creating a new Console Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeConsole = new castoeStreamer.CastoeConsole({});
```

## Customizing the Console Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeConsole = new castoeStreamer.CastoeConsole({
	traceFile: true,
	date: 'LT'
});
```

<!-- ### Colors
To customize the colors, there isn't a much customizability yet there but the colors that are able to be customized are based of the [colors package](https://www.npmjs.com/package/colors#text-colors). -->

## Using the Console Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeConsole = new castoeStreamer.CastoeConsole({
	traceFile: true
});

castoeConsole.send('This gets send to the console.');
```

# Bugs / Issues / Features
If you found a bug, or if you have any ideas to implement into Castoe Streamer, you could contact me on discord using the following tag `Cassie#8330`. You could also join the official support server [here](https://discord.gg/3BjWtjn), on the other hand you could also just support an issue on the [github repo](https://github.com/DevCassie/Castoe-Streamer/issues).

# Contributing
Castoe Streamer is licensed under the MIT license. Which means you are free to contribute to the package by forking the repository or cloning the master branch and create a pull request.