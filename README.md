# CPSC559 Project - Distributed File System

Distributed file system that allows users to upload, download and delete files. 
<pre>
Client --> Proxy --> Server --> 
                                Mongodb Atlas
Client <-- Proxy <-- Server <-- 
</pre> 

## TODOs (for MVP)
- Fix UploadFile request -> sending json body    
[Error] Preflight response is not successful. Status code: 404  
[Error] XMLHttpRequest cannot load http://localhost:2222/upload due to access control checks.  
[Log] AxiosError {stack: "AxiosError@http://localhost:3000/static/js/bundle.…ttp://localhost:3000/static/js/bundle.js:55022:77", message: "Network Error", name: "AxiosError", code: "ERR_NETWORK", config: Object, …} (bundle.js, line 522)  
[Error] Failed to load resource: Preflight response is not successful. Status code: 404 (upload, line 0)

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
### Proxy - (port 2222)
Forwards http requests from the client to the server

### Server - (port 1111)
Forwards http requests from the proxy to mongodb

# Dependencies
- MongoDB Atlas
- React
- Node
- Express
- Axios
- DownloadJs
- Bootstrap