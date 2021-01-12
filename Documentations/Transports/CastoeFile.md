# CastoeFile

The main usage of the CastoeFile.
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeFile = new castoeStreamer.CastoeFile({});
// Information to send to a file.
castoeFile.send('Some info to send');
```

Castoe file currently contains 4 methods that can be used.

<br>

# Methods

<br>

## .send(input)
> Writes to a file specified in the [CastoeFileOptions](#castoefileoptions).
> <br>
> | Parameter       | Type        |
> |---------------- |-----------  |
> | input           | String      |
> <br>
>
> **Example:**
> ```JavaScript
> const castoestreamer = require('castoe-streamer');
> const castoeFile = new castoestreamer.CastoeFile({
> file: 'castoeFile.txt'
> });
> castoeFile.send('Data to send to file.');
> ```
> **Returns {Promise}**

<br>

## .read(callback)
> Reads data from the file specified in the [CastoeFileOptions](#castoefileoptions).
> <br>
> | Parameter       | Type        |
> |---------------- |------------ |
> | callback        | Function    |
> <br>
>
> **Example:**
> ```JavaScript
> const castoestreamer = require('castoe-streamer');
> const castoeFile = new castoestreamer.CastoeFile({
> file: 'castoeFile.txt'
> });
> castoeFile.read((data) => console.debug(data));
> ```
> **Returns {undefined}**

<br>

## .clone(cloneFile)
> Clones the file specified in the [CastoeFileOptions](#castoefileoptions).
> | Parameter       | Type        |
> |---------------- |------------ |
> | cloneFile       | String      |
> <br>
> 
> **Example:**
> ```JavaScript
> const castoestreamer = require('castoe-streamer');
> const castoeFile = new castoestreamer.CastoeFile({
> file: 'castoeFile.txt'
> });
> castoeFile.clone('newClone.txt');
> ```
>
> **Returns {Promise}**

<br>

## .delete()
> Deletes the file specified in the [CastoeFileOptions](#castoefileoptions).
> <br>
>
> **Example:**
> ```JavaScript
> const castoestreamer = require('castoe-streamer');
> const castoeFile = new castoestreamer.CastoeFile({
> file: 'castoeFile.txt'
> });
> castoeFile.delete();
> ```
>
> **Returns {Promise}**

<br>

# Typedefs

## CastoeFileOptions
<br>

> Options for the CastoeFile in Object format.
> <br>
>  
> | Key    	    | Value   	                                            | Description                                                                 	    |
> |-----------	|----------------------------------------------------   |---------------------------------------------------------------------------------  |
> | file      	| String  	                                            | The name of the file that gets written.                                           |
> | dirname? 	  | Boolean 	                                            | This option specifies in which directory the automated backups should be saved. 	|
> | automatic?  | Boolean 	                                            | Wether automated backups should be enabled or not.                      	        |
> | overwrite?  | Boolean  	                                            | Should the backup file be overwritten or should there be a new file created?      |
> | options?    | [CastoeFileStreamOptions](#castoefilestreamoptions)  	| Option for how the file should be written. fs.createWriteStream() options.        |

<br>

## CastoeFileStreamOptions
<br>

> Options for the fs.createWriteStream method. Below are the values that are used within the package. You can always adjust more by adding using the options found [here]((https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options)).
> <br>
> 
> | Key           | Value         | Description                                                               |
> |-------------- |-------------- |-------------------------------------------------------------------------- |
> | flags         | String        | [File system flags](https://nodejs.org/api/fs.html#fs_file_system_flags). |
> | encoding      | String        | Text encoding. Default is: 'utf8'.                                        |
