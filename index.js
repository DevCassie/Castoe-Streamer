const Logger = require('./src/Transports/index.js');

const Console = new Logger.Console();

const array = ['Testing', 'Testin2', 'Testing3']

Console.send(array);