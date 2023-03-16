const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const PORT = 1111;
app.use(bodyParser.json());

const api = axios.create({
    baseURL: "https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint" // address to mongodb
});

const uploadFile = (name, file) => api.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
const deleteFile = (name) => api.post(`/delete?name=${name}`);
const downloadFile = (name) => api.get(`/download?name=${name}`);

const servers = [
    { id: 1, address: 'http://localhost:1111' },
    { id: 2, address: 'http://localhost:5555' },
  ];

// const replicateToServers = (method, path, data) => {
// servers.forEach((server) => {
//     if (server.address !== `http://localhost:${PORT}`) { // skip current server
//     axios({
//         method,
//         url: `${server.address}${path}?name=${data.name}`,
//         data
//     })
//     .then((response) => {
//         console.log(`Replicated ${method} ${path} to server ${server.id}`);
//     })
//     .catch((err) => {
//         console.log(`Error replicating ${method} ${path} to server ${server.id}:`, err);
//     });
//     }
// });
// };
  
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
      // if (req.body.flag != 'replica') {
      //   replicateToServers('POST', '/upload', { name: req.query.name, file: req.body.file, flag: "replica" });
      // }
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
      // if (req.body.flag != 'replica') {
      //   replicateToServers('POST', '/delete', { name: req.query.name, flag: 'replica' });
      // }
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