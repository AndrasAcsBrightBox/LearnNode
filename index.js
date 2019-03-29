const http = require('http');
const url = require('url');
const parseXmlString = require('xml2js').parseString;

const baseUrl = 'http://nyvdevdaweb4/icmservice.daicmsql4.15/DealAxis';

const server = http.createServer((req, res) =>
{
    var urlRequested = req.url.substr(1);
    switch(urlRequested) {
        case 'login':
            if(req.method != 'POST') {
                res.writeHead(500);
                res.end('Login method must be issued with a POST request.');
                return;
            }
            let postedBody = '';
            req.on('data', chunk => {
                postedBody += chunk.toString();
            });
            let loginData = null;
            req.on('end', () => { 
                loginData = JSON.parse(postedBody);
                http.get(baseUrl + `/security/users/${loginData.uname}/access?password=${loginData.pass}`, (resp) => {
                    res.writeHead(200, {
                        'Content-Type' : 'application/json'
                    });
                    let loginResponse = '';
                    resp.on('data', chunk => {
                        loginResponse += chunk.toString();
                    })
                    resp.on('end', () => {
                        parseXmlString(loginResponse, (err, loginResponseJson) =>  {
                            res.end(JSON.stringify(loginResponseJson));
                        });
                    });
                })
            });
        break;
    }
});

server.listen(5000);