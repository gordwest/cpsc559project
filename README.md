# CPSC559 Project - Distributed File System

Distributed file system that allows users to upload, download and delete files.

## TODOs (for MVP)
- Create proxy and configure (another http server? forward requests?)
- Allow client to make HTTP requests to local server (doesn't like local client and local server)
- Make client UI better (low priority)

# Setup / Run
## Client
```bash
# get packages
cd client
npm ci

# run client
npm start
```
## Server
```bash
# get packages
cd server
npm ci

# run server
node server
```


# Dependencies
- MongoDB Atlas
- React
- Node
- Express
- Axios
- DownloadJs
- Bootstrap