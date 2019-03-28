const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

var myEmitter = new MyEmitter();

myEmitter.on('event',  () => console.log('Event fired!'));

// fire the event!
myEmitter.emit('event');