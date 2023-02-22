import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile } from '../server_api';

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
        <div>
        <input type="file" onChange={handleFileChange} />
        <Button onClick={handleUploadClick}>Upload</Button>
        </div>
    );
}

export default FileUpload;