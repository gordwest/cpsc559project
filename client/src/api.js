// API used by the client to interact with the local server (server.js)

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:1111', // target server (Main Proxy URL)
    timeout: 10000
});

const api_backup = axios.create({
    baseURL: 'http://localhost:2222', // target server (backup Proxy URL)
    timeout: 10000
});

let leader_proxy = api

export const retreiveFiles = () => {
    return leader_proxy.get(`/files`)
    .then(response => {
        console.log(response.data);
        return response.data;
    })
    .catch(err => {
        // console.log(`Proxy ${api} crashed.. Switching to ${api_backup}`)
        leader_proxy = api_backup // assign new proxy leader
        return leader_proxy.get(`/files`)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(err => console.log(err));
        });
    };
  
export const uploadFile = (name, file) => leader_proxy.post(`/upload?name=${name}`, {file:file}, {headers: {'content-type': 'application/json'}});
export const deleteFile = (name) => leader_proxy.post(`/delete?name=${name}`);
export const downloadFile = (name) => leader_proxy.get(`/download?name=${name}`);

