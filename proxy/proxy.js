const express = require('express');
const app = express();
const PORT = 2222;

const servers = ['http://localhost:1111', 'http://localhost:5555'];

// Proxy middleware
// const { createProxyMiddleware } = require('http-proxy-middleware');

// Load balancer
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

const proxies = (req, res) => {
  // Forward the request to all replicas
  for (const server of servers) {
    proxy.web(req, res, { target: server });
  }
};

// active replication - forward requests to all servers
// create an instance of the middleware for each host URL

// // Create an array of proxies, one for each server
// const proxies = servers.map((server) => {
//   return createProxyMiddleware({
//     target: server,
//     changeOrigin: true
//   });
// });

// // Load balancer - use the first proxy for all requests
// const loadBalancer = (req, res, next) => {
//   proxies[0](req, res, next);
// };


// // this will combine all the proxies into a single middleware function that will forward requests to all servers
// const proxy = (req, res, next) => {
//   proxies.forEach((p) => p(req, res, next));
// };

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Start proxy server on port
app.use('/', proxies);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
