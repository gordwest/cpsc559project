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

const bodyParser = require('body-parser');

// add server to active server list
function addServer(server) {
    servers.push(server);
    console.log(`Server ${server} added to active server list: [${servers}]\n`);
}

// endpoint to add server to active server list
app.post(`/online`, bodyParser.json(), (req, res) => {
    const server = req.body.server;
    addServer(server);
    res.send(`Server ${server} added to active server list: [${servers}]\n`);
});

const roundRobinServers = (req, res) => {
    // get server addr
    const server = servers[server_idx];

    const serverPromise = new Promise((resolve, reject) => {
        console.log(`Forwarding ${req.method} ${req.path} request to ${server}`)
        proxy.web(req, res, { target: server }, () => {
            reject(server);
        });
    });
    console.log(''); // newline for readability

    serverPromise
        .then((server) => {
            console.log(`Forwarding request to ${server}`);
        })
        .catch((error) => {
            console.log(`Server ${error} crashed..`);
            const index = servers.indexOf(error);
            servers.splice(index, 1);
            console.log(`Active server list: [${servers}]\n`)
            server_idx = 0 // reset index

            // replace failure with new successful response from other replica
            let server_redo = servers[0]
            const serverPromise_redo = new Promise((resolve, reject) => {
                console.log(`Redirecting ${req.method} ${req.path} request to ${server_redo}\n`)
                proxy.web(req, res, { target: server_redo }, () => {
                    reject(server_redo);
                });
            });
            serverPromise_redo
                .then((server_redo) => {
                    res.send(res); // reply back to client with redirected response
                })
                .catch((error) => {
                    console.log(`failed..`);
                })

        });
        // go to next server in round robin
        if (server_idx >= servers.length-1) server_idx = 0
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
