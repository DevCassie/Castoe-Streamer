# Castoe Streamer Documentations

### Install and import
Install command using NPM: <br>
`npm install castoe-streamer`

Install command using yarn: <br>
`yarn isntall castoe-streamer`

Importing into the project: <br>
```JavaScript
const castoeStreamer = require("castoe-streamer");
```

## Currently implemented Classes & Functions
* [Transports](./Transports/index.md)
	* [Console](./Transports/ConsoleTransport.md)
	* [File](./Transports/FileTransport.md)
	* [Stream](./Transports/StreamTransport.md)
* [Functions](./Functions/index.md)
	* [Clear](./Functions/Clear.md)
	* [Clone](./Functions/Clone.md)
	* [Delete](./Functions/Delete.md)
	* [Rename](./Functions/Rename.md)

## Accessing the Transports or Functions
```JavaScript
// For the Transports
const castoeConsole = new castoeStreamer.Transports.Console();

// For the Functions
castoeStreamer.Functions.delete('./some/file');
```