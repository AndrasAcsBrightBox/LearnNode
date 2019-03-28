const os = require('os');

console.log(`Os platform: ${os.platform()}`); // win32, darwin

console.log(`Architecture: ${os.arch()}`); // architecture

// console.log(os.cpus());

console.log(`
    Free memory: ${os.freemem()}.
    Total memory: ${os.totalmem()}.
    Free: ${(os.freemem() / os.totalmem() * 100).toFixed(2)} %` );

// Home directory
console.log(os.homedir());

// OS uptime
console.log(os.uptime());