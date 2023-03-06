# CPSC559 Project - Distributed File System
Distributed file system that allows users to upload, download and delete files. 
<pre>
Client --> Proxy --> Server --> 
                                Mongodb Atlas
Client <-- Proxy <-- Server <-- 
</pre> 

![FileSystem](preview.jpg)

# Setup / Run
### Main Server
```bash
# get packages
cd server
npm ci

# run server
node server
```

### Server Replica1
``` bash
```

### Proxy
```bash
# get packages
cd proxy
npm ci

# run proxy
node proxy
```

### Client
```bash
# get packages
cd client
npm ci

# run client
npm start
```

# HTTP Servers
### Proxy -> (http://localhost:2222)
- Forwards HTTP requests between the clients and the servers

### Server -> (http://localhost:1111)
- Receives HTTP requests from the proxy
- Interacts directly with MongoDB

# MongoDB Endpoints
- Main MongoDB URL -> https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint
- MongoDB Replica1 URL -> https://us-east-1.aws.data.mongodb-api.com/app/filesystemrep1-uzxxi/endpoint
- MongoDB Replica2 URL -> ...

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