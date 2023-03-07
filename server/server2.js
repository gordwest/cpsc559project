const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const PORT = 5555;
app.use(bodyParser.json());

const api = axios.create({
    baseURL: "https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep1-uzxxi/endpoint" // address to mongodb
});

const uploadFile = (name, file) => api.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
const deleteFile = (name) => api.post(`/delete?name=${name}`);
const downloadFile = (name) => api.get(`/download?name=${name}`);

// // allow cross-origin requests (only required in proxy.js)
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

const servers = [
    { id: 1, address: 'http://localhost:1111' },
    { id: 2, address: 'http://localhost:5555' },
  ];

const replicateToServers = (method, path, data) => {
servers.forEach((server) => {
    if (server.address !== `http://localhost:${PORT}`) { // skip current server
    axios({
        method,
        url: `${server.address}${path}`,
        data
    })
    .then((response) => {
        console.log(`Replicated ${method} ${path} to server ${server.id}`);
    })
    .catch((err) => {
        console.log(`Error replicating ${method} ${path} to server ${server.id}:`, err);
    });
    }
});
};
  
  

// retreive all files from db
app.get('/files', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    api.get(`/files`)
    .then((response) => {
      res.json({ files: response.data });
    //   replicateToServers('get', '/files', response.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
  });

// add new file to db
app.post('/upload', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    uploadFile(req.query.name, req.body.file)
    .then((response) => {
      res.json(response.data);
      replicateToServers('post', '/upload', { name: req.query.name, file: req.body.file });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
  });

app.get('/download', (req, res) => {
  console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
  downloadFile(req.query.name)
  .then((response) => {
    res.json(response.data);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ error: err.message });
  });
});


app.post('/delete', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    deleteFile(req.query.name)
    .then((response) => {
      res.json(response.data);
    //   replicateToServers('post', '/delete', { name: req.query.name });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

app.options('/upload', (req,res) => {
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});