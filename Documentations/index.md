# Castoe Streamer Documentations

## Install and import
Install command using NPM: `npm install castoe-streamer`

Install command using yarn: `yarn isntall castoe-streamer`

Importing into the project: <br>
```JavaScript
const castoeStreamer = require("castoe-streamer");
```

## Currently implemented Classes & Functions
* Classes
	* [CastoeConsole](./Transports/CastoeConsole.md)
	* [CastoeFile](./Transports/CastoeFile.md)
	* [CastoeStream](./Transports/CastoeStream.md)
* Functions
	* [Clear](./Functions/Clear.md)
	* [Clone](./Functions/Clone.md)
	* [Delete](./Functions/Delete.md)
	* [Rename](./Functions/Rename.md)

## Accessing the Classes and Functions.
To access the Classes simply use the keyword `new` and add the class to it. Example:
```JavaScript
const logger = new castoeStreamer.CastoeConsole({});
```
<br>

To acces the Functions simply use the function name and their parameters. Example:
```JavaScript
castoeStreamer.Delete('./some/file.txt');
```