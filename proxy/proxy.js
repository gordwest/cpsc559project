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


// const targets = ['http://localhost:1111', 'http://localhost:1112', 'http://localhost:1113']; // target hosts (replica servers URLs)

// target hosts (replica servers) and weights
const targets = [
  { target: 'http://localhost:1111', weight: 1 }, { target: 'http://localhost:1112', weight: 2 }, { target: 'http://localhost:1113', weight: 3 }
]; 
let totalWeight = targets.reduce((acc, curr) => acc + curr.weight, 0); // total weight of all replicas
let currentIndex = 0;


// creates a separate proxy for each target hosts
const proxies = targets.map(target => createProxyMiddleware({
  target: target.target,
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

// // Round-robin load balancing to distribute requests among replicas
// let index = 0;
// app.use('/', (req, res, next) => {
//   proxies[index](req, res, next);
//   index = (index + 1) % proxies.length;
// });

// weighted round-robin load balancing to distribute requests among replicas
app.use('/', (req, res, next) => {
  let weight = 0;

  for (let i = currentIndex; i < targets.length; i++) {
    const target = targets[i];
    weight += target.weight;
    // if weight is greater than total weight, then set currentIndex to target server index
    if (weight >= totalWeight) {
      currentIndex = i;
      break;
    }
    // if end of target array, start from the beginning
    if (i === targets.length - 1) {
      i = -1;
    }
  }  
  proxies[currentIndex](req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
