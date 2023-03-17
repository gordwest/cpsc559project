// API used by the client to interact with the local server (server.js)

import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:2222' // target server (Proxy URL)
// });

const primaryBaseUrl = 'http://localhost:2222';
const backupBaseUrl = 'http://localhost:3333';

const api = axios.create({
  baseURL: primaryBaseUrl, // use primary proxy by default
});

// switch to backup proxy if primary proxy fails
api.interceptors.response.use(
  response => response,
  error => {
    api.defaults.baseURL = backupBaseUrl;
    console.log('Switched to backup baseURL:', api.defaults.baseURL);
    return Promise.reject(error);
  }
);

export const retreiveFiles = () => {
    console.log('Retrieving files');
    return api.get(`/files`)
    .then(response => {
        console.log(response.data);
        return response.data;
    })
    .catch(err => console.log(err));
};
  
export const uploadFile = (name, file) => api.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
export const deleteFile = (name) => api.post(`/delete?name=${name}`);
export const downloadFile = (name) => api.get(`/download?name=${name}`);

