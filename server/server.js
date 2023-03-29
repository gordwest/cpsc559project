const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const { writeLog, readLog } = require('./logger');

const PORT = 3333;
app.use(bodyParser.json());

const api = axios.create({
    baseURL: "https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint" // address to mongodb
});

const uploadFile = (name, file) => api.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
const deleteFile = (name) => api.post(`/delete?name=${name}`);
const downloadFile = (name) => api.get(`/download?name=${name}`);

const servers = [
    { id: 2, address: 'http://localhost:5555' },
    // { id: 3, address: 'http://localhost:7777' },
    //   { id: 1, address: 'http://localhost:3333' },
];

const replicateToServers = (method, path, data) => {
    servers.forEach((server) => {
        axios({
            method,
            url: `${server.address}${path}?name=${data.name}`,
            data
        })
        .then((response) => {
            console.log(`Replicated ${method} ${path} to server ${server.id}`);
        })
        .catch((err) => {
            console.log(`Error replicating ${method} ${path} to server ${server.id}:`, err);
        });
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

        // write to log
        writeLog(PORT, 'UPLOAD', req.query.name);

        // forward request to other replica servers
        if (req.body.flag != 'replica') {
            replicateToServers('POST', '/upload', { name: req.query.name, flag: 'replica' });
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
    // write to log 
    writeLog(PORT, 'DOWNLOAD', req.query.name);
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

        // write to log
        writeLog(PORT, 'DELETE', req.query.name); 

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

app.get(`/logs`, async (req, res) => {
    try {
        const logs = await readLog(PORT);
        res.status(200).json({ logs });
    } catch (err) {
        console.log(`Error reading log file:`, err);
        res.status(500).json({ error: err.message });
    }
});

const syncInterval = 30000;

const syncReplicaServers = async () => {
    try {
        const replicaLogs = await Promise.all(servers.map((server) => 
            axios.get(`${server.address}/logs`)));
        const logsToRecover = new Set();

        // combine the logs from onine replica servers
        replicaLogs.forEach((response) => {
            response.data.logs.forEach((log) => {
                logsToRecover.add(log);
            });
        });

        // update this server's log file with the combined logs
        const promises = Array.from(logsToRecover).map((log) => {
            const [timestamp, method, fileName] = log.split(' - ');
            if (method === 'UPLOAD') {
                return downloadFile(fileName)
                .then((response) => { 
                    uploadFile(fileName, response.data.file); 
                })
                .catch((err) => {
                    console.log(`Error syncronizing UPLOAD ${fileName}`, err);
                })
            } else if (method === 'DELETE') {
                return deleteFile(fileName)
                .catch((err) => {
                    console.log(`Error syncronizing DELETE ${fileName}`, err);
                })
            }
        });

            await Promise.all(promises);
            console.log(`Successfully syncronized replica servers. @ ${new Date()}`);
        } catch (err) {
            console.log(`Error syncronizing replica servers:`, err);
        }
    };


setInterval(syncReplicaServers, syncInterval);

app.options('/upload', (req,res) => {
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});