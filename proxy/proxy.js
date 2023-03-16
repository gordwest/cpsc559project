const express = require('express');
const app = express();
const PORT = 2222;

const servers = ['http://localhost:1111', 'http://localhost:5555'];

// use http-proxy to forward requests to other servers
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

const replicateToServers = (req, res) => {
  const requests = servers.map((server) => { // map each server to a promise
    return new Promise((resolve) => { // create a promise for each server
      proxy.web(req, res, { target: server }, () => {
        resolve(server);
      });
    });
  });

  // promise race allows us to send the resposne of the first successful request 
  // back to the proxy as soon as it is available without waiting for all requests to complete
  // will reduce latency and improve performance vs promise.all (which will wait for all requests to complete)
  Promise.race(requests)
    .then((server) => {
      console.log(`Forwarded request to server: ${server}`);
    })
    .catch((error) => {
      console.error(`Failed to forward request: ${error}`);
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
