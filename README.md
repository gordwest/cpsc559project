# CPSC559 Project - Distributed File System

Distributed file system that allows users to upload, download and delete files. 
<pre>
Client --> Proxy --> Server --> 
                                Mongodb Atlas
Client <-- Proxy <-- Server <-- 
</pre> 

## TODOs (for MVP)
- Make client UI better (low priority)

# Setup / Run
### Server
```bash
# get packages
cd server
npm ci

# run server
node server
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
### Proxy - (port 1234)
Forwards http requests from the client to the server

### Server - (port 1112)
Forwards http requests from the proxy to mongodb

# Dependencies
- MongoDB Atlas
- React
- Node
- Express
- Axios
- DownloadJs
- Bootstrap