# CastoeConsole

The main usage of the CastoeConsole.
```JavaScript
const castoestreamer = require('castoe-streamer');
const castoeConsole = new castoestreamer.CastoeConsole({});
```
CastoeConsole currently only contains two [Methods](#methods). However CastoeConsole can contain [options](#castoeconsoleoptions) to customize the console output.

<br>

# Methods

## .clear()
> Clears the current console transport. Just like command prompts cls, but built in the package.
> 
> **Example:**
> ```JavaScript
> const castoestreamer = require('castoe-streamer');
> const castoeConsole = new castoestreamer.CastoeConsole({
> name: 'Castoe Console'
> });
> castoeConsole.clear();
> ```
> **Returns {Promise}**

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
> const castoeConsole = new castoestreamer.CastoeConsole({
> name: 'Castoe Console'
> });
> castoeConsole.send({ ID: 1 });
> ```
> **Returns {Promise}** 

<br>

# TypeDefs

## CastoeConsoleOptions
<br>

> Options for the CastoeConsole in Object format. These options only change visual output.
> <br>
>  
> | Key    	    | Value   	                                  | Description                                                                 	|
> |-----------	|------------------------------------------   |-----------------------------------------------------------------------------	|
> | name?      	| String  	                                  | Name of the console transport.                                              	|
> | traceFile? 	| Boolean 	                                  | Wether the console should also output the file that the log is called from. 	|
> | showType?  	| Boolean 	                                  | Wether the console should show what type the input is.                      	|
> | date?      	| String  	                                  | [Moment.js date format](https://momentjs.com/docs/#/displaying/format/). If this is used the timestamp will return.           	|
> | colors?    	| [CastoeColorOptions](#castoecoloroptions)  	| What colors should the types be?                                            	|

<br>

## CastoeColorOptions
<br>

> Color options for the CastoeConsole. These options are based of from the npm package [colors](https://www.npmjs.com/package/colors/). From which I've used the [text colors values](https://www.npmjs.com/package/colors#text-colors). These color options are in Object format.
>
> | Key         | Value           | Description                     |
> |------------ |---------------- |-------------------------------- |
> | bigint      | String          | Color for the bigint output.    |
> | boolean     | String          | Color for the boolean output.   |
> | function    | String          | Color for the function output.  |
> | number      | String          | Color for the number output.    |
> | object      | String          | Color for the object output.    |
> | string      | String          | Color for the string output.    |
> | symbol      | String          | Color for the symbol output.    |