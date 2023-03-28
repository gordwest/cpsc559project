const { rejects } = require('assert');
const express = require('express');
const app = express();
const PORT = 1111;
// const PORT = 25564;
const doomsdays = 5; // number of requests before brick
let req_count = 0;
let server_idx = 0;

// brick proxy after doomsday reached
function briiiick(req_count) {
    if (req_count >= doomsdays) {
        console.log("\nPROXY CRASHED!! Redirecting in 10 seconds...");
        setTimeout(() => {
            while(1){
                console.log("Proxy offline...");
            } 
        }, "3000");
    }
}

let servers = ['http://localhost:3333', 'http://localhost:5555', 'http://localhost:7777'];

// use http-proxy to forward requests to other servers
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

const roundRobinServers = (req, res) => {
    // pick a server
    const server = servers[server_idx];

    const serverPromise = new Promise((resolve, reject) => {
        console.log(`Forwarding ${req.method} ${req.path} request to ${server}`)
        proxy.web(req, res, { target: server }, () => {
            // resolve(server);
            reject(server);
        });
    });
    console.log(''); // newline for readability

    Promise.all([serverPromise])
    .then((server) => {
        console.log(`Forwarding request to ${server}`);
    })
    .catch((error) => {
        console.log(`Server ${error} crashed..`);
        const index = servers.indexOf(error);
        servers.splice(index, 1);
        console.log(`Active server list: [${servers}]\n`)
        res.status(500).send('Failed to forward request');
    });
    // go to next server in round robin
    if (server_idx === server.length) server_idx = 0
    else server_idx++;

    // brick server
    // briiiick(req_count++) // UNCOMMENT TO ACTIVATE DOOMSDAY CLOCK
}

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/', roundRobinServers);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
