const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // build file path
    let filePath = path.join(
        __dirname,
        'public',
        req.url === '/'
            ? 'index.html'
            : req.url);
        
    switch (path.extname(filePath)) {
        case '.html':
            res.writeHead(200, {
                'Content-Type' : 'text/html'
            });
        break;

        case '.js':
        res.writeHead(200, {
            'Content-Type' : 'text/javascript'
        });
        break;

        case '.css':
            res.writeHead(200, {
                'Content-Type' : 'text/css'
            });
        break;

        case '.json':
            res.writeHead(200, {
                'Content-Type' : 'application/json'
            });
        break;

        case '.png':
            res.writeHead(200, {
                'Content-Type' : 'image/png'
            });
        break;

        case '.jpg':
            res.writeHead(200, {
                'Content-Type' : 'image/jpg'
            });
        break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if(err.code == 'ENOENT'){
                fs.readFile(path.join(__dirname, 'public', '404.html'), 
                (err, content) => {
                    res.writeHead(200, {
                        'Content-Type' : 'text/html'
                    });
                    res.end(content, 'utf-8');
                })
            }
            else {
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        }
        else {
            res.end(content, 'utf-8');
        }
    });
});

// This may come from an environment variable.
const PORT = process.env.PORT || 5000; 

server.listen(PORT,
    () => {
        console.log(`Server running on ${PORT}.`)
    });