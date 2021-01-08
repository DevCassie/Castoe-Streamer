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
* Transports
	* [Console](./Transports/ConsoleTransport.md)
	* [File](./Transports/FileTransport.md)
	* [Stream](./Transports/StreamTransport.md)
* Functions
	* [Clear](./Functions/Clear.md)
	* [Clone](./Functions/Clone.md)
	* [Delete](./Functions/Delete.md)
	* [Rename](./Functions/Rename.md)

## Accessing the Transports or Functions
```JavaScript
// For the Transports
const castoeConsole = new castoeStreamer.CastoeConsole();

// For the Functions
castoeStreamer.Delete('./some/file.txt');
```
 
To get detailed information about the Transports or Functions. Please go to the documentation of the desired Transport or Function.