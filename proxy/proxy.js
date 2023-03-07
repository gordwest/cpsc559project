const express = require('express');
const app = express();
const PORT = 2222;

const servers = ['http://localhost:1111', 'http://localhost:5555'];

// Proxy middleware
const { createProxyMiddleware } = require('http-proxy-middleware');
const target = 'http://localhost:1111'; // target host (Server URL)
const proxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  router: function () {
    return servers[Math.round(Math.random())] // randomly pick a server
  },

  onProxyReq: function onProxyReq(proxyReq, req, res) {
    console.log(`Forwarding ${req.method} ${req.path} request to server..`);
},
});

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Start proxy server on port
app.use('/', proxy);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
