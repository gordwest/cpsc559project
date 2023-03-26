const { rejects } = require('assert');
const express = require('express');
const app = express();
const PORT = 1111;
// const PORT = 25564;
const doomsdays = 39; // number of requests before brick
let req_count = 0;

function freeze() {
    while(1){
        // setTimeout(() => {
            console.log("Proxy offline...");
        //   }, "500");
    }
}

let servers = ['http://localhost:3333', 'http://localhost:5555', 'http://localhost:7777'];

// use http-proxy to forward requests to other servers
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

const replicateToServers = (req, res) => {
  const requests = servers.map((server) => { // map each server to a promise
        return new Promise((resolve, reject) => { // create a promise for each server
            console.log(`Forwarding ${req.method} ${req.path} request to ${server}`)
            
            // brick proxy after doomsday reached
            req_count++;
            if (req_count >= doomsdays) {
                console.log("\nPROXY CRASHED!! Redirecting in 10 seconds...");
                setTimeout(() => {
                    freeze() 
                }, "3000");
            }

            proxy.web(req, res, { target: server }, () => {
                // resolve(server);
                reject(server);
            });
        });
  });
  console.log(''); // newline for readability

  // promise race allows us to send the resposne of the first successful request 
  // back to the proxy as soon as it is available without waiting for all requests to complete
  // will reduce latency and improve performance vs promise.all (which will wait for all requests to complete)
  Promise.race(requests)
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
};

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Start proxy server on port
app.use('/', replicateToServers);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
