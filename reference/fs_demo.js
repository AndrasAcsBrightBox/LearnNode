const fs = require('fs');
const path = require('path');

// TODO --> fix if empty!

//  create folder
/* Async, but msot of these have an Sync version, like fs.mkdirSync() */
/* Asyncs has callback functions */

const testFile = path.join(__dirname, 'test', 'hello.txt');
var renamedFile = path.join(path.dirname(testFile), 'helloWorld.txt');

if (fs.existsSync(testFile)) {
    console.log(`File '${path.basename(testFile)}' exists, deleting it...`);

    // Use arrow notation
    fs.unlink(testFile, err => {
        if(err) throw err;
        console.log('File deleted.');
    });
}
if (fs.existsSync(renamedFile)) {
    console.log(`File '${path.basename(testFile)}' exists, deleting it...`);

    // Use arrow notation
    fs.unlink(renamedFile, err => {
        if(err) throw err;
        console.log('File deleted.');
        removeDir();
    });
}else {
    removeDir();
}

function removeDir() {
    fs.rmdir(path.dirname(testFile), err => {
        if(err) throw err;
        console.log('Folder deleted.');
        createFolderAndFile();
    });
}


function createFolderAndFile() {
    fs.mkdir(path.join(__dirname, 'test'), {}, function(err) {
        if(err) throw err;
        console.log('Folder created.');
    });

    // Create and write to a file
    fs.writeFile(testFile, 'hello world into the text file!', err => {
        if (err) throw err;
        // Add text to a file
        fs.appendFile(testFile, ' I love NodeJs.', err => {
            if (err) throw err;
            console.log('file written to!');
            readFile();
        })
    }); 
}

function readFile() {
    fs.readFile(testFile, 'utf8', (err, data) => {
        console.log(data);
        rename();
    });
}

// Rename a file
function rename() {
    fs.rename(testFile, renamedFile, err => {
        if(err) throw err;
    });
}