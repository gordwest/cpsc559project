const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 1112;
app.use(bodyParser.json());

const api = axios.create({
    baseURL: "https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint" // address to mongodb
});

const uploadFile = (name, file) => api.post(`/upload?name=${name}&file=${file}`);
const deleteFile = (name) => api.post(`/delete?name=${name}`);
const downloadFile = (name) => api.get(`/download?name=${name}`);

// allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// retreive all files from db
app.get('/files', (req, res) => {
    console.log('Fowarding /files request to mongo..');
    api.get(`/files`)
    .then(response => {
        res.json({ files: response.data });
    })
    .catch((err) => console.log(err));
});

// add new file to db
app.post('/upload', (req, res) => {
    console.log(`Fowarding /upload file request for ${req.query.name} to mongo..`);
    uploadFile(req.query.name, req.query.file)
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

app.get('/download', (req, res) => {
    console.log(`Fowarding /download file request for ${req.query.name} to mongo..`);
    downloadFile(req.query.name)
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

app.post('/delete', (req, res) => {
    console.log(`Fowarding /delete file request for ${req.query.name} to mongo..`);
    deleteFile(req.query.name)
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

app.use((req, res) => {
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
