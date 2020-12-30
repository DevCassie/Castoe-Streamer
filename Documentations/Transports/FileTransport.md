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

## Using the File Transport
```JavaScript
const castoeStreamer = require('castoestreamer');
// Console transport.
const castoeFile = new castoeStreamer.Transports.File({
	name: 'castoeLog.txt',
  flags: 'a',
  automatic: true,
  overwrite: false,
  maxFiles: 2
});

// Information to send to a file.
castoeFile.send('Some info to send');

// Expected output:
/* A new file called castoeLog.txt with the following content:
Some info to send
*/

// To delete a file simply do this:
castoeFile.delete();

// To clone a file, you need two parameters such as:
castoeFile.clone('castoeLog.txt', 'newFile.txt');
// File gets cloned with the content.
```