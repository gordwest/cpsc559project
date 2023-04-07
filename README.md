# CPSC559 Project - Distributed File System
TODOs
- Add a way for replica servers to track which proxy is talking to them -> necessary to restart server when main proxy crashes (currently hardcoded in Fastforword() method).
- Add a legitimate form of synchronization -> maybe lock file or logical timestamps??
- Reverse list of document when restarting crashed server to match order of other servers (not critial)
- Update the report document
- Add a 4th replica server?? Maybe ask TA
- Find bugs/break the application (continuous)

### Potential Demo Scenarios
- [ ] What happens when two people try to delete/download the same file?
- [ ] Prevent multiple files with same name being uploaded (not critical)
- [x] Backup proxy has correct 'active server list' at all times
- [x] App functionally continues to work on remaining servers when 1-2 replicas crash (Main Proxy)
- [x] App functionally continues to work on remaining servers when 1-2 replicas crash (Backup Proxy)
- [x] Proxy & replica servers get update their 'active server list' when a server crashes
- [ ] Fast forward works when restarting a crashed server (from backup proxy)
- [x] Fast forward works when restarting a crashed server (from main proxy)
- [x] Backup proxy takes over if primary proxy fails


Distributed file system that allows users to upload, download and delete files. 
<pre>
Client --> Proxy --> Server --> 
                                Mongodb Atlas
Client <-- Proxy <-- Server <-- 
</pre> 

![FileSystem](preview.jpg)

# Setup / Run
### Main Server + Replicas (run in separate terminals)
```bash
# get server packages
cd server
npm ci

# run main server
node server

# new terminal
cd server
# run replica server 1
node server2

# new terminal
cd server
# run replica server 2
node server3
```
### Restart Crashed Server
```bash
# use the '-r' flag
node server -r
```

### Proxy
```bash
# get proxy packages
cd proxy
npm ci

# run main proxy
node proxy

# run main proxy with 10 request "Doomsday clock"
node proxy 10

# new terminal
# run backup proxy
cd proxy
node proxy2
```

### Client
```bash
# get client packages
cd client
npm ci

# run client
npm start
```

# HTTP Servers
### Main Proxy -> (http://localhost:8888)
- Randomly picks a server to forwards HTTP requests to
- Relays HTTP responses back to client
### Backup Proxy -> (http://localhost:9999)

### Main Server -> (http://localhost:1111)
- Receives HTTP requests from the proxy
- Interacts directly with MongoDB
- Replicates requests to other server(s) "gossip"

### Server Replica 1 -> (http://localhost:2222)
### Server Replica 2 -> (http://localhost:3333)

# MongoDB Endpoints
- Main MongoDB URL -> https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint
- MongoDB Replica1 URL -> https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep1-uzxxi/endpoint
- MongoDB Replica2 URL -> https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep2-tyemh/endpoint

### GET /Files
Returns all files in the database.  
- Params: NONE  
- Body: NONE
``` bash
# main
https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/files
# replica 1
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep1-uzxxi/endpoint/files
```
### POST /Upload
Insert a new file document into the database.  
- Params: name
- Body: { file : < fileData >}
``` bash
# main
https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/upload
# replica 1
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep1-uzxxi/endpoint/upload
```
### GET /Download
Download an existing file from the database.  
- Params: name  
- Body: NONE
``` bash
# main
https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/download
# replica 1
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep1-uzxxi/endpoint/download
```
### POST /Delete
Remove an existing file from the database.  
- Params: name  
- Body: NONE
``` bash
# main
https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/delete
# replica 1
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep1-uzxxi/endpoint/delete
```

# Dependencies
- MongoDB Atlas
- React
- Node
- Express
- Axios
- DownloadJs
- Bootstrap