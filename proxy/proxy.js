const express = require('express');
const app = express();
const PORT = 2222;

// Proxy middleware
const { createProxyMiddleware } = require('http-proxy-middleware');
// const target = 'http://localhost:1111'; // target host (Server URL)
// const proxy = createProxyMiddleware({
//   target,
//   changeOrigin: true,

//   onProxyReq: function onProxyReq(proxyReq, req, res) {
//     console.log(`Forwarding ${req.method} ${req.path} request to server..`);
// },
// });


const targets = ['http://localhost:1111', 'http://localhost:1112', 'http://localhost:1113']; // target hosts (replica servers URLs)
// creates a separate proxy for each target hosts
const proxies = targets.map(target => createProxyMiddleware({
  target,
  changeOrigin: true,

  onProxyReq: function onProxyReq(proxyReq, req, res) {
    console.log(`Forwarding ${req.method} ${req.path} request to server..`);
  },
}));

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Only required in server.js
// app.options('/upload', (req,res) => {
//     res.status(204).send();
// });

// // Start proxy server on port
// app.use('/', proxy);

// Round-robin load balancing to distribute requests among replicas
let index = 0;
app.use('/', (req, res, next) => {
  proxies[index](req, res, next);
  index = (index + 1) % proxies.length;
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
