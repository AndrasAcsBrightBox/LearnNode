const http = require('http');

// create a server object
http.createServer((request, response) => {
    // Write a response
    response.write('Hello world!');
    response.end();
}).listen(5000,
    () => {
        console.log('server running.');
    });