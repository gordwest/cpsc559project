const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 1234;
app.use(bodyParser.json());

const mongo_base_uri = "https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint";

// retreive all files from db
app.get('/files', (req, res) => {
    axios.get(mongo_base_uri + "/files")
    .then(response => {
        res.json({ files: response.data });
    })
    .catch((err) => console.log(err));
});

// add new file to db
app.post('/upload', (req, res) => {
    axios.post(mongo_base_uri + "/upload", null, {
        params: { 
            name: req.query.name,
            file: req.query.file }
    })
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});


app.post('/delete', (req, res) => {
    axios.post(mongo_base_uri + "/delete", null, {
        params: { name: req.query.name}
    })
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

app.use((req, res) => {
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
