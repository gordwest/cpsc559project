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
const clearDB = () => api.post(`/brick`);

let servers = ['http://localhost:1111', 'http://localhost:2222', 'http://localhost:3333'];

// used to catch up a crashed server
function fastForward() {
    console.log("Recovering Crashed Server..")
    // clear local db
    api.post(`/brick`);
    // query /files of an active server (dynamically pick an active server to query via randomization)
    const activeReplica = servers[Math.floor(Math.random() * servers.length)];
    axios.get(`${activeReplica}/files`)
        .then((response) => {
            // populate local db with files from active server 
            response.data.files.forEach((f) => {
                uploadFile(f.name, f.file)
            })
        })
        .catch((err) => {
            console.log(err);
        });

    // after recovery, notify proxy that this server is back online
    axios.post(`http://localhost:8888/online`, {server: `http://localhost:${PORT}`})
        .then((response) => {
            console.log(`Notified proxy that server ${PORT} is back online..`);
        })
        .catch((err) => {
            console.log(`Error notifying proxy that server ${PORT} is back online:`, err);
        });
}

// server starting in 'restart' mode -> fast forward to state of another active replica
if (process.argv[2] == '-r') {
    fastForward()
}

// endpoint to let the proxy know that this server is back online after a crash
app.post('/online', (req, res) => {
    console.log(`Server ${PORT} is back online..`);
    res.status(200).send(`Server ${PORT} is back online..`);
});

// update this server's list of active replica servers
app.post('/update-lists', bodyParser.json(), (req, res) => {
    const updatedLists = req.body.servers;
    servers.length = 0; // clear array
    updatedLists.forEach((server) => {
        servers.push( server );
    });
    console.log(`Active server list: ${updatedLists}`);
    res.status(200).send({ message: 'Server list updated' });
});

const replicateToServers = (method, path, data) => {
    servers.forEach((server) => {
        if (server != `http://localhost:${PORT}`) {
            axios({
                method,
                url: `${server}${path}?name=${data.name}`,
                data
            })
            .then((response) => {
                console.log(`Replicated ${method} ${path} to server ${server.slice(-1)}`);
            })
            .catch((err) => {
                console.log(`Error replicating ${method} ${path} to server ${server.slice(-1)}:`, err);
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
        // forward request to other replica servers
        if (req.body.flag != 'replica') {
            replicateToServers('POST', '/upload', { name: req.query.name, file: req.body.file, flag: 'replica' });
        }
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
        // forward request to other replica servers
        if (req.body.flag != 'replica') {
            replicateToServers('POST', '/delete', { name: req.query.name, flag: 'replica' });
        }
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