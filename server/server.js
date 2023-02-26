const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const PORT = 1111;
app.use(bodyParser.json());

const api = axios.create({
    baseURL: "https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint" // address to mongodb
});

// const uploadFile = (name, file) => api.post(`/upload?name=${name}&file=${file}`);
// const uploadFile = (name, file) => api.post(`/upload`, {name:name, file:file}, {headers: {'content-type': 'application/json'}});
// const uploadFile = (name, file) => api.post(`/upload?name=${name}`, "FILE DATA", {headers: {'content-type': 'text/plain'}});
const uploadFile = (name, file) => api.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
const deleteFile = (name) => api.post(`/delete?name=${name}`);
const downloadFile = (name) => api.get(`/download?name=${name}`);

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// retreive all files from db
app.get('/files', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    api.get(`/files`)
    .then(response => {
        res.json({ files: response.data });
    })
    .catch((err) => console.log(err));
});

// add new file to db
app.post('/upload', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    console.log("SERVER: " + req.query.name, req.body);
    uploadFile(req.query.name, req.body.file)
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

app.get('/download', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    downloadFile(req.query.name)
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

app.post('/delete', (req, res) => {
    console.log(`Forwarding ${req.method} ${req.path} request to mongodb..`);
    deleteFile(req.query.name)
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
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
