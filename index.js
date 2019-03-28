const Person = require('./person'); // <-- CommonJS
// we are using .require(), beacuse Node not using the normal import from ES6 yet.
const Logger = require('./logger');

const person1 = new Person('John Doe', 30);
person1.greeting();

const logger = new Logger();
logger.on('message', (data) => console.log(`Called listener`, data));
logger.log('Hello world!');