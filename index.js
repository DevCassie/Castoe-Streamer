const Logger = require('./src/Transports/index.js');
const fs = require('fs');

const File = new Logger.Stream({
	name: new Logger.File({
		name: new fs.createWriteStream('./Testing.txt')
	})
});

File.send('Testimng');