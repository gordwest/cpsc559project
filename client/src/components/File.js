import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import downloadjs from 'downloadjs';

const MONGO_URI = 'https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint';

function File(props) {
    // const [fileBin, setFileBin] = useState("");

    async function deleteFile(name) {
        console.log("DELETING: " + name)
        try {
            const response = await axios.post(MONGO_URI + '/delete', null, { params:
                {"name" : name}
            });
            console.log(response.data)
        } catch (err) {
          console.log(err)
        }
    }

    async function downloadFile(name) {
        console.log("DOWNLOADING: " + name)
        try {
            const response = await axios.get(MONGO_URI + '/download', { params:
                {"name" : name}
            });
            // download file locally
            console.log(response.data.file);
            downloadjs(response.data.file, name)

        } catch (err) {
          console.log(err)
        }
      }

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Button onClick={() => downloadFile(props.name)}>
            Download
        </Button>
        <Button onClick={() => deleteFile(props.name)}>
            Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default File;