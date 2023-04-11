# CPSC559 Project - Distributed File System

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
# replica 2
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep2-tyemh/endpoint/files
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
# replica 2
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep2-tyemh/endpoint/upload
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
# replica 2
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep2-tyemh/endpoint/download
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
# replica 2
https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep2-tyemh/endpoint/delete
```

# Dependencies
- MongoDB Atlas
- React
- Node
- Express
- Axios
- DownloadJs
- Bootstrap