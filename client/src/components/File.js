import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import downloadjs from 'downloadjs';
import { downloadFile, deleteFile } from "../api";

// const MONGO_URI = 'https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint';

function File(props) {

    const handleDownloadClick = async () => {
        downloadFile(props.file.name)
        .then ( (response) => { downloadjs(response.data.file, props.file.name) } )
        .catch ( (err) => { console.log(err) } )
    };

    const handleDeleteClick = async () => {
      deleteFile(props.file.name)
      .then ( (response) => { console.log(response, props.file.name) } )
      .catch ( (err) => { console.log(err) } )
    };

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.file.name}</Card.Title>
        <Button onClick={() => handleDownloadClick()}>
            Download
        </Button>
        <Button onClick={() => handleDeleteClick()}>
            Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default File;