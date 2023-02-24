import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../api';

function FileUpload() {
    const [file, setFile] = useState("");
    const [fileBin, setFileBin] = useState("");

    async function uploadFileWrapper(name, data) {
        console.log(name);
        console.log(data);
        try {
            const response = await uploadFile(name, file);
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
        <div style={{ border: 'solid black 2px', borderRadius: '0.5rem', backgroundColor: '#F5F5F5'}}>
        <input type="file" onChange={handleFileChange} style={{ margin:'1rem'}}/>
        <Button onClick={handleUploadClick} style={{  margin:'1rem', fontFamily: 'Helvetica'}}>Upload</Button>
        </div>
    );
}

export default FileUpload;