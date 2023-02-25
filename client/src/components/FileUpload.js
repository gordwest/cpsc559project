import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../api';
import './File.css';
import axios from 'axios';

const uploadBox = {
    border: 'solid #4AF626 2px',
    borderRadius: '0.5rem',
    backgroundColor: '#000000',
    padding: '2rem',
    boxShadow: '4px 4px 8px 0px #4AF626',
    marginTop: '2rem',
    marginBottom: '1rem',
}

const chosenFile = {
    color: '#4AF626',
    paddingLeft: '1rem',
    fontWeight: '900',
    fontSize: '20px',
}

function FileUpload() {
    const [file, setFile] = useState("");
    const [fileBin, setFileBin] = useState("");

    async function uploadFileWrapper(name, data) {
        console.log(name);
        console.log(data);
        try {
            const response = await uploadFile(name, data);
            console.log(response);
        } catch (err) {
        console.log(err)
        }
    }

    const handleFileChange = (event) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
            console.log(event.target.files[0]);

            // base64 encode file
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); 
            reader.onloadend = function() {
                setFileBin(reader.result);
                console.log(reader.result);
            }
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }
        fetch('https://httpbin.org/post', {
        method: 'POST',
        body: file,
        headers: {
            'content-type': file.type,
            'content-length': `${file.size}`,
        },
        })
        .then((res) => res.json())
        .then((data) => uploadFileWrapper(file.name, fileBin))
        .catch((err) => console.error(err));
    };

    return (
        <div style={uploadBox}>
            <label className="file-upload-button">
                <input type="file" onChange={handleFileChange} />
                Choose File
            </label>
            <label style={chosenFile}>{file.name}</label>
        <Button className="uploadbuttonz" onClick={handleUploadClick} >Upload</Button>
        </div>
    );
}

export default FileUpload;