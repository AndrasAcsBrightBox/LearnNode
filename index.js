const http = require('http');
const https = require('https');
const url = require('url');
const parseXmlString = require('xml2js').parseString;
const jsonToXml = require('json2xml');

const dealAxisServiceBaseUrl = 'http://nyvdevdaweb4/icmservice.daicmsql4.15/DealAxis/';
const apiServiceBaseUrl = 'http://nyvdevdaweb4';

const jsonContentType = {
    'Content-Type' : 'application/json'
};

const server = http.createServer((req, res) =>
{
    var urlRequested = req.url.substr(1);
    switch(urlRequested) {
        case 'login':
            login(res, req);
        break;

        case 'conferences':
            conferences(req, res);
        break;
    }
});

function conferences(req, res) {
    if(req.method != 'GET') {
        res.writeHead(500);
        res.end('`Conferences´ method must be issued with a GET request.');
        return;
    }
    var currentDate = new Date();
    var oneWeekAhead = addDays(currentDate, 7);
    
    var startDate = toXmlApiDate(currentDate);
    var endDate = toXmlApiDate(oneWeekAhead);

    var eventFilterCommand = `<EventFilterCommand xmlns="http://schemas.datacontract.org/2004/07/Dealogic.DL2.ICM.APIServices.DataContracts.Custom.Events">
    <DateRange>
        <End xmlns="http://schemas.datacontract.org/2004/07/Dealogic.DL2.ICM.APIServices.DataContracts.Custom">${endDate}</End>
        <Start xmlns="http://schemas.datacontract.org/2004/07/Dealogic.DL2.ICM.APIServices.DataContracts.Custom">${startDate}</Start>
    </DateRange>
    </EventFilterCommand>`;

    const options = {
        hostname: 'nyvdevdaweb4.dlgroup.com',
        port: 80,
        path: '/icmservice.daicmsql4.15/API/events/eventsforclientportal',
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
            'Content-Length': eventFilterCommand.length
            }
        };
    
    var confResult = ''; 
    var request = http.request(options, (result) => {      
        result.on('data', (chunk) => {
            confResult += chunk;
        });

        result.on('end', () => {
            parseXmlString(confResult, (err, confListJson) => {
                if(err) throw err;

                var confereces = [];
                if(confListJson.ResponseOfClientInterest.Count[0] > 0) {

                    confListJson.ResponseOfClientInterest.Results[0]["a:ClientInterest"].forEach((conference) => {
                        confereces.push( {
                            name: conference['a:Name'][0]['b:Value'][0],
                            startDate : conference['a:StartDate'][0],
                            endDate : conference['a:EndDate'][0],
                            city : conference['a:CityNames'][0]["b:LocalizedString"][0]['b:Value'][0]
                        });
                });
                res.writeHead(200, jsonContentType);
                res.end(JSON.stringify(confereces));
            }
            });
        })
    });

    request.write(eventFilterCommand);
    request.end();

    function toXmlApiDate(date) {
        return  `${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${(date.getDate()).pad(2)}T00:00:00`;
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}

function login(res, req) {
    if(req.method != 'POST') {
        res.writeHead(500);
        res.end('`Login´ method must be issued with a POST request.');
        return;
    }
    let postedBody = '';
    req.on('data', chunk => {
        postedBody += chunk.toString();
    });
    let loginData = null;
    req.on('end', () => { 
        loginData = JSON.parse(postedBody);
        http.get(dealAxisServiceBaseUrl + `security/users/${loginData.uname}/access?password=${loginData.pass}`, (resp) => {
            let loginResponse = '';
            resp.on('data', chunk => {
                loginResponse += chunk.toString();
            })
            resp.on('end', () => {
                parseXmlString(loginResponse, (err, loginResponseJson) =>  {
                    if(loginResponseJson.ClientPortalAuthenticationDTO.AuthenticationStatus == "Denied") {
                        res.writeHead(401, jsonContentType);
                        res.end(JSON.stringify({
                            "access" : "denied"
                        }));
                    }
                    else {
                        res.writeHead(200, jsonContentType);
                        res.end(JSON.stringify({
                            "access" : "granted",
                            "authUserName" : loginResponseJson.ClientPortalAuthenticationDTO.InternetUserId
                        }));
                    }
                });
            });
        })
    });
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

server.listen(5000);