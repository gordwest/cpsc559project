/*
    hmm DevServer Proxy essentially fixes CORS Errors...
    so we could potentially remove the cors rule from server.js ? 
    line 17-23
    - havent tried. ...low priority.

    // how to proxy https://www.npmjs.com/package/http-proxy-middleware#working-examples
*/

const express = require('express');
const app = express();
const PORT = 1112;

// Proxy middleware
const { createProxyMiddleware } = require('http-proxy-middleware');
const target = 'http://localhost:1111'; // target host (Server URL)
const proxy = createProxyMiddleware({
  target,
  changeOrigin: true,
});

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Start proxy server on port
app.use('/', proxy);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
