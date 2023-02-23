// API used by the client to interact with the local server (server.js)

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:2222/' // target server (Proxy URL)
});

export const retreiveFiles = () => {
    console.log('Retrieving files');
    return api.get(`/files`)
    .then(response => {
        console.log(response.data);
        return response.data;
    })
    .catch(err => console.log(err));
};
  
export const uploadFile = (name, file) => api.post(`/upload?name=${name}&file=${file}`);
export const deleteFile = (name) => api.post(`/delete?name=${name}`);
export const downloadFile = (name) => api.get(`/download?name=${name}`);
