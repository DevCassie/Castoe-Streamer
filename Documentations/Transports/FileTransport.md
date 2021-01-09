## Main import
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Remaining code....
```

## Using the File Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const castoeFile = new castoeStreamer.CastoeFile({
	name: 'castoeLog.txt',
  automatic: true,
  overwrite: false,
  options: { flags: 'a+' }
});

// Information to send to a file.
castoeFile.send('Some info to send');
// Expected output:
/* A new file called castoeLog.txt with the following content:
Some info to send
*/

// To delete a file simply do this:
castoeFile.delete();

// To clone a file, you just need to pass in one parameter. That would be the name of the clonedFile.
castoeFile.clone('newFile.txt');
// File gets cloned with the content.

// To read the files content, all you have to do is use a callback function.
castoeFile.read((data) => console.debug(data));
// Data that is inside the castoeFile will be thrown in the console.
```