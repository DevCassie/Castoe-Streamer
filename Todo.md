# Castoe Logger To Do.

All To Do Items can be found in here. Those items are seperated in different categories.


## Transports
- [x] Console Transport.
	- [x] Options.
		- [x] Show name.
		- [x] Show date.
		- [x] Show type.
		- [x] Show file.
		- [x] Color support.
	- [x] Destructure an Object.
- [x] File Transport.
	- [x] Options.
		- [ ] File.
		- [ ] Automatic backups.
		- [ ] Overwrite backup file.
		- [ ] Flags.
	- [x] Clone method.
	- [x] Delete method.
	- [x] Send method.
- [ ] HTTP Transport?
- [ ] Functions.
	- [x] Rename.
	- [x] Clone.
	- [x] Clear.
	- [x] Delete.

## Methods
- [x] Send. Standard Castoe Logger method to send to a file or console.
- [ ] Info. Castoe Info Logger to send information to a file or console.
- [ ] Error. Castoe Error Logger to send information to a file or console.
- [ ] Warn. Castoe Warn Logger to send information to a file or console.
- [ ] Clear. Castoe Clear function to remove messages in the console or file.

## Syntax
```javascript

const castoeFile = new CastoeLogger.CastoeFile({
	file: 'file.txt',
	automatic: true,
	overwrite: true,
	flags: 'a+'
});

castoeFile.send('Something to send.');

const castoeConsole = new CastoeLogger.CastoeConsole({
	name: 'Castoe Console',
	showType: false,
	traceFile: true
});

castoeConsole.send('Testing');
```