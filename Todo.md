# Castoe Logger To Do.

All To Do Items can be found in here. Those items are seperated in different categories.

# Version V1 To-Do Items.

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
		- [x] File.
		- [x] Automatic backups.
		- [x] Overwrite backup file.
		- [x] Flags.
	- [x] Clone method.
	- [x] Delete method.
	- [x] Send method.
- [ ] HTTP Transport?
- [x] Functions.
	- [x] Rename.
	- [x] Clone.
	- [x] Clear.
	- [x] Delete.

## Methods
- [x] Send. Standard Castoe Logger method to send to a file or console.
- [x] Info. Castoe Info Logger to send information to a file or console.
- [x] Error. Castoe Error Logger to send information to a file or console. Error name.
- [x] Warn. Castoe Warn Logger to send information to a file or console.
- [x] Clear. Castoe Clear function to remove messages in the console or file.

# Version V2 To do Items.

## CastoeConsole
- Methods
  - createLogFile() -> Returns a logged .log file from the console output.
  - info() -> Info log for the Console Transport. Perhaps with a default color, text style or symbol.
  - debug() -> Debug log for Console Transport. Perhaps with a default color, text style or symbol.
  - error() -> Error log for the Console Transport. Perhaps with a default color, text style or symbol.
- Options
  - GZip support -> Impact on the createLogFile() method.
	- Format support -> Change format of the layout. Including brackets etc.
	- traceFile format -> Change the format of the traceFile option.

## CastoeFile
- Methods
  - 
- Options
  - Multiple file support -> Perhaps with arrays and filtering the index?