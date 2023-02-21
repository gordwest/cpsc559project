import { useState } from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button';

const MONGO_URI = 'https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint';

function FileUpload() {
    const [file, setFile] = useState("");
    const [fileBin, setFileBin] = useState("");

    async function uploadFile(name, data) {
        console.log('UPLOAD FILE: ' + name);
        console.log('FILE DATA: ' + data);

        try {
            const response = await axios.post(MONGO_URI + '/upload', null, { params:
            {
                "name" : name,
                "file" : data
            }});
            console.log(response.data)
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
        console.log('FILE: '+file);
        console.log('FILEBIN: '+fileBin);

        fetch('https://httpbin.org/post', {
        method: 'POST',
        body: file,
        headers: {
            'content-type': file.type,
            'content-length': `${file.size}`,
        },
        })
        .then((res) => res.json())
        .then((data) => uploadFile(file.name, fileBin))
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