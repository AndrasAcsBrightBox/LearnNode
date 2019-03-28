const path = require('path');

// Base file name
console.log(__filename);
console.log(`The basename of the path: ${path.basename(__filename)}`);

// dirname
console.log(`The dirname of the path: ${path.dirname(__filename)}`);

// file extension
console.log(`The extension name: ${path.extname(__filename)}`);

// get an object from the __filename:
var pathObj = path.parse(__filename);
console.log(pathObj);

// Join paths --> concetane paths:
// ../tests/hello.html
console.log(path.join(__dirname, 'test', "hello.html"));