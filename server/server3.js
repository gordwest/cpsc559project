const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const PORT = 7777;
app.use(bodyParser.json());

const api = axios.create({
    baseURL: "https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep2-tyemh/endpoint/" // address to mongodb
});

const uploadFile = (name, file) => api.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
const deleteFile = (name) => api.post(`/delete?name=${name}`);
const downloadFile = (name) => api.get(`/download?name=${name}`);

const servers = [
    { id: 1, address: 'http://localhost:3333' },
    { id: 2, address: 'http://localhost:5555' },
    { id: 3, address: 'http://localhost:7777' },
];
  
// retreive all files from db
app.get('/files', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    api.get(`/files`)
    .then((response) => {
      res.json({ files: response.data });
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