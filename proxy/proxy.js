const { rejects } = require('assert');
const express = require('express');
const app = express();
const PORT = 8888;
// const PORT = 25564;
let doomsdays = 999; // number of requests before brick
let req_count = 0;
let server_idx = 0;

if (process.argv[2] != NaN) {
    doomsdays = process.argv[2]
}

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

let servers = ['http://localhost:1111', 'http://localhost:2222', 'http://localhost:3333'];

// use http-proxy to forward requests to other servers
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const axios = require('axios');
const bodyParser = require('body-parser');

// add recovered serer back to active server list
function addServer(restarted_server) {
    // check if server already exists in active server list
    if (!servers.includes(restarted_server)){
        servers.push(restarted_server);
        console.log(`\nServer ${restarted_server} added to active server list.\n`);

        // active server list becomes out of date after a server crash, update recovered server with current active server list
        notifyServers(servers);
        notifyProxies(servers);
    } else {
        console.log(`Server ${restarted_server} already exists in active server list!\n`);
    }
}

// notify other servers of updated server list
function notifyServers(activeServers) {
    activeServers.forEach(server => {
        axios.post(`${server}/update-lists`, {servers: activeServers})
        .then((res) => {
            console.log(`Notifying ${server} of updated server list.`);
        })
        .catch((err) => {
            console.log(`Error notifying ${server} of updated server list.`);
        });
    });
}

// notify other proxy of updated server list
function notifyProxies(activeServers) {
    var backup_proxy = 'http://localhost:9999'
    axios.post(`${backup_proxy}/update-lists`, {servers: activeServers})
    .then((res) => {
        console.log(`Notifying ${backup_proxy} of updated server list.`);
    })
    .catch((err) => {
        console.log(`Error notifying ${backup_proxy} of updated server list.`);
    });
}

const requestQueue = [];

function printRequestQueueTimestamps() {
    console.log("\nCurrent requestQueue timestamps:");
    requestQueue.forEach((requestWrapper, index) => {
        console.log(`[${index}]: ${requestWrapper.req.headers['x-timestamp']}, ${requestWrapper.req.url}`);
    });
}
// function that processes requests in the queue in order of timestamp (x-timestamp) header
function processRequests() {
    requestQueue.sort((a, b) => parseInt(a.req.headers['x-timestamp']) - parseInt(b.req.headers['x-timestamp']));

    // the first request in the queue gets processed and removed from the queue
    if (requestQueue.length > 0) {
        const { req, res } = requestQueue.shift();
        if (req.path === '/delete' || req.path === '/upload' || req.path === '/download') { // check if request method is DELETE or POST
            console.log(`\nTimestamp: ${req.headers['x-timestamp']}, ${req.url}`); // Add console log for timestamp and client port
        }
        requestHandler(req, res);
    }
    // timeout to process the next request in the queue
    setTimeout(processRequests, 1000);
}

processRequests();

function roundRobinServers(req, res) {
    // get server addr
    const server = servers[server_idx];
    const serverPromise = new Promise((resolve, reject) => {
        console.log(`Forwarding ${req.method} ${req.path} request to ${server}.`)
        proxy.web(req, res, { target: server }, () => {
            reject(server);
        });
    });

    serverPromise
        .then((server) => {
            console.log(`Forwarding request to ${server}.`);
        })
        .catch((error) => {
            console.log(`Server ${error} crashed!`);
            const index = servers.indexOf(error);
            servers.splice(index, 1);
            console.log(`Active server list: [${servers}]\n`)
            server_idx = 0 // reset index

            // notify other servers of updated server list
            notifyServers(servers);
            notifyProxies(servers);

            // replace failure with new successful response from other replica
            let server_redo = servers[0]
            const serverPromise_redo = new Promise((resolve, reject) => {
                console.log(`Redirecting ${req.method} ${req.path} request to ${server_redo}.\n`)
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
    briiiick(req_count++) // UNCOMMENT TO ACTIVATE DOOMSDAY CLOCK
}

function broadcastServers(req, res) {
    const requests = servers.map((server) => { // map each server to a promise
        return new Promise((resolve, reject) => { // create a promise for each server
            console.log(`Forwarding ${req.method} ${req.path} request to ${server}`)
            
            // brick proxy after doomsday reached
            briiiick(req_count++) // UNCOMMENT TO ACTIVATE DOOMSDAY CLOCK
            
            proxy.web(req, res, { target: server }, () => {
                // resolve(server);
                reject(server);
            });
        });
    });
    console.log(''); // newline for readability
    
    Promise.all(requests)
        .then((server) => {
            console.log(`Forwarding request to ${server}`);
        })
        .catch((error) => {
            console.log(`Server ${error} crashed!`);
            const index = servers.indexOf(error);
            servers.splice(index, 1);
            console.log(`Active server list: [${servers}]\n`)
            server_idx = 0 // reset index

            // notify other servers of updated server list
            notifyServers(servers);
            notifyProxies(servers);

            res.send("server crashed..");
        });
};

// determines how to handle client request
const requestHandler = (req, res) => {
    if (req.method == 'GET' || req.method == 'OPTIONS') {
        roundRobinServers(req, res)
    }
    if (req.method == 'POST') {
        broadcastServers(req, res)
    }
};

// endpoint to add server to active server list
app.post(`/online`, bodyParser.json(), (req, res) => {
    var server = req.body.server;
    addServer(server);
    res.send(`Server ${server} added to active server list.`);
});

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add OPTIONS method
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-timestamp'); // Add x-timestamp header
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') { // Preflight request. Reply successfully:
        res.status(200).send();
    } else {
        next();
    }
});

app.use('/', (req, res) => {
    requestQueue.push({ req, res });
    printRequestQueueTimestamps();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
