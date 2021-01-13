# CastoeConsole

The main usage of the CastoeConsole.
```JavaScript
const castoestreamer = require('castoe-streamer');
const castoeConsole = new castoestreamer.CastoeStream({});
```
CastoeStream currently only contains one [Method](#methods). CastoeStream is the stream transport if you wish to have a custom stream type. This is specified in the [options](#castoestreamoptions).

<br>

# Methods

## .send(*input, callback?*)
> Writes the input to a console or terminal.
>
> | Parameter     | Type      |
> |-------------  |---------  |
> | input         | Any       |
> | callback      | Function  |
> <br>
>
> **Example:**
> ```JavaScript
> const castoestreamer = require('castoe-streamer');
> const castoeStream = new castoestreamer.CastoeConsole({
> stream: fs.createWriteStream('someFile_.txt')
> });
> castoeStream.send({ ID: 1 });
> ```
> **Returns {undefined}** 

<br>

# TypeDefs

## CastoeStreamOptions
<br>

> Options for the CastoeStream class are in Object format.
> <br>
>  
> | Key    	    | Value   	                                  | Description                                                                 	              |
> |-----------	|------------------------------------------   |-------------------------------------------------------------------------------------------	|
> | stream    	| Stream  	                                  | A stream transport supported by the package [stream](https://nodejs.org/api/stream.html). 	|