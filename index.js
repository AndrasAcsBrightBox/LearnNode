const http = require('http');
const path = require('path');
const fs = require('fs');

function servePage(pageFileName, req, res) {
    fs.readFile(path.join(__dirname, 'public', pageFileName), 
            (err, content) => {
                if(err) throw err;
                res.writeHead(200, {
                    'Content-Type' : 'text/html'
                });
                res.end(content);
            });
}

const server = http.createServer(
    (req, res) => {
        
        
        switch(req.url){
            case '/':
                servePage('index.html', req, res); 
            break;

            case '/about':
                servePage('about.html', req, res); 
            break;

            case '/api/users':
                let users = [
                    { 'name' : 'John Doe', 'age': 30},
                    { name: 'Bob Smith', age: 40}
                ];
                res.writeHead(200, {
                    'Content-Type' : 'application/json'
                });
                res.end(JSON.stringify(users));
            break;
        }
    }
);

// This may come from an environment variable.
const PORT = process.env.PORT || 5000; 

server.listen(PORT,
    () => {
        console.log(`Server running on ${PORT}.`)
    });