# Castoe Logger To Do.

All To Do Items can be found in here. Those items are seperated in different categories.


## Transports
- [ ] Console Transport.
- [ ] File Transport.
- [ ] HTTP Transport.

## Features
- [ ] Show/Hide date.
- [ ] Show/Hide file from log call.
- [ ] Show/Hide project Name.

## Methods
- [ ] Send. Standard Castoe Logger method to send to a file or console.
- [ ] Info. Castoe Info Logger to send information to a file or console.
- [ ] Error. Castoe Error Logger to send information to a file or console.
- [ ] Warn. Castoe Warn Logger to send information to a file or console.
- [ ] Clear. Castoe Clear function to remove messages in the console or file.
- [ ] Delete. Castoe Delete function to delete a file.

## Syntax
```javascript

const castoe = new CastoeLogger({
	name: 'Castoe Project'
	Transports: [
		console: new CastoeConsole(),
		file: new CastoeFile()
	],
	date: 'HH:mm A',
	file: true
});

castoe.send('Something to send.');
```