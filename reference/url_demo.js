const url = require('url');

// used to be url.parse -->that is now deprecated

const myUrl = new URL('http://mywebsite.com:8000/hello.html?id=110&status=active');

console.log(myUrl.href);
console.log(myUrl.toString());

console.log(myUrl.host); // with port

console.log(myUrl.hostname); // without port 

console.log(myUrl.pathname); // actual file

console.log(myUrl.search); // Query String returned 

var params = myUrl.searchParams;
myUrl.searchParams.append('abc', 123);
console.log(params);

myUrl.searchParams.forEach((value, name) => {
    console.log(`${name} --> ${value}`)
});
