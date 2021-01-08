## Main import
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Remaining code....
```

## Using the Stream Transport
```JavaScript
const castoeStreamer = require('castoe-streamer');
// Console transport.
const stream = new castoeStreamer.CastoeStream({
  stream: fs.createWriteStream('some_file.txt');
});

// To write to the stream, simply use the .send() method. Which takes in the input to send to the stream.
stream.send('Some information');
```