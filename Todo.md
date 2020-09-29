# Castoe Logger To Do.

All To Do Items can be found in here. Those items are seperated in different categories.


## Transports
- [x] Console Transport.
	- [ ] Options.
		- [ ] Show Name.
		- [ ] Show date.
		- [ ] Show file.
	- [ ] Destructure an Object.
- [ ] File Transport.
	- [ ] Options.
		- [x] File.
		- [ ] Automatic backups.
		- [ ] Flags.
	- [ ] Clone method.
	- [ ] Delete method.
	- [ ] Send method.
- [ ] HTTP Transport?

## Methods
- [x] Send. Standard Castoe Logger method to send to a file or console.
- [ ] Info. Castoe Info Logger to send information to a file or console.
- [ ] Error. Castoe Error Logger to send information to a file or console.
- [ ] Warn. Castoe Warn Logger to send information to a file or console.
- [ ] Clear. Castoe Clear function to remove messages in the console or file.

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