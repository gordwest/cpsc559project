const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const PORT = 1112;
app.use(bodyParser.json());

const api = axios.create({
    baseURL: "https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint" // address to mongodb
});

const uploadFile = (name, file) => {
    api.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
    // Replicate file to all replicas
    replicaManager.replicate(name, file);
};
const deleteFile = (name) => {
    api.post(`/delete?name=${name}`);
    // Delete file from all replicas
    replicaManager.deleteReplica(name);
};
const downloadFile = (name) => {
    let replica = replicaManager.getReplica();
    // api.get(`/download?name=${name}`);
    axios.get(`${replica}/download?name=${name}`).then(response => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response.data));
    }).catch(err => {
        console.log('Error downloading file from replica: ' + replica);
        res.status(500).send('Error downloading file from replica: ' + replica);
    });
};
let replicaNodes = ['http://localhost:1111', 'http://localhost:1112', 'http://localhost:1113'];

// Replica Manager Object to handle replication
const replicaManager = {
    replicas:[],
    init: function() {
        replicaNodes.forEach((node) => {
            this.replicas.push({url: node, state: 'active'});
        });
    },
    // Replicate file to all active replicas
    replicate: function(name, file) {
        this.replicas.forEach((replica) => {
            // Only replicate to active replicas
            if (replica.state === 'active') {
                // Send POST request to replica with file data and name as query parameter 
                axios.post(`${replica.url}/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}}).then (response => {
                    console.log('Replication successful for replica: ' + replica.url);
                }).catch(err => {
                    // If replication fails, set replica state to inactive
                    console.log('Replication failed for replica: ' + replica.url);
                    replica.state = 'inactive';
                });
            }
        }, this);
    },
    // Delete file from all active replicas
    deleteReplica: function(name) {
        // Iterate through all replicas
        this.replicas.forEach((replica) => {
            // Only delete from active replicas
            if (replica.state === 'active') {
                // Send POST request to replica with name as query parameter
                axios.post(`${replica.url}/delete?name=${name}`).then (response => {
                    console.log('Deletion successful for replica: ' + replica.url);
                }).catch(err => {
                    // If deletion fails, set replica state to inactive
                    console.log('Deletion failed for replica: ' + replica.url);
                    replica.state = 'inactive';
                });
            }
        }, this);
    },
    // Download file from active replica and return file data
    gossip: function() {
        // Select random replica from replica list and send GET request to /state endpoint
        let replica = this.replicas[Math.floor(Math.random() * this.replicas.length)];
        axios.get('${replica.url}/state').then(response => {
            let updatedReplicas = {
                url: replica.url,
                state: response.data.state
            };
        // Find index of replica in replica list and update state
        let index = this.replicas.findIndex((replica) => replica.url === updatedReplicas.url);
        this.replicas[index] = updatedReplicas;
        // If replica is inactive, replicate all files to replica
        if (updatedReplicas.state === 'inactive') {
            console.log('Replica ' + updatedReplicas.url + ' is inactive');
            this.replicateAll();
        }
        }).catch(err => {
            console.log('Gossip failed for replica: ' + replica.url);
        });
    },
    // Replicate all files to inactive replica
    replicateAll: function() {
        let activeReplicas = this.replicas.filter((replica) => replica.state === 'active');
        let files = [];
        // Iterate through all active replicas and get list of files
        for (let i = 0; i < activeReplicas.length; i++) {
            // Send GET request to replica and add files to files array
            axios.get(`${activeReplicas[i].url}/files`).then(response => {
                files = files.concat(response.data.files);
                // If last active replica, iterate through all inactive replicas and replicate all files
                if (i === activeReplicas.length - 1) {
                    for (let j = 0; j < this.replicas.length; j++) {
                        if (this.replicas[j].state === 'inactive') {
                            // Iterate through all files and replicate to replica
                            for (let k = 0; k < files.length; k++) {
                                // Send POST request to replica with file data and name as query parameter
                                axios.post(`${this.replicas[j].url}/upload?name=${files[k].name}`, {file:files[k].file}, {headers: {'content-type': 'application/json'}}).then (response => {
                                    console.log('Replication successful for replica: ' + this.replicas[j].url);
                                    this.replicas[j].state = 'active';
                                }).catch(err => {
                                    console.log('Replication failed for replica: ' + this.replicas[j].url);
                                });
                            }
                        }
                    }
                }
            }).catch(err => {
                console.log('Replication failed for replica: ' + activeReplicas[i].url);
            });
        }
    },
    // Get random active replica from replica list
    getReplica: function() {
        let replica = this.replicas[Math.floor(Math.random() * this.replicas.length)];
        if (replica.state === 'active') {
            return replica;
        } else {
            return this.getReplica();
        }
    }
};

    // getReplica: function() {
    //     let index = Math.floor(Math.random() * this.replicas.length);
    //     return this.replicas[index];
    // }

// }

    //         this.replicas = this.replicas.map((replica) => {
    //             if (replica.url === updatedReplicas.url) {
    //                 return updatedReplicas;
    //             } else {
    //                 return replica;
    //             }
    //         });
    //     }).catch(err => {
    //         console.log('Gossip failed for replica: ' + replica.url);
    //     });
    // },

// // allow cross-origin requests (only required in proxy.js)
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

replicaManager.init();

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
