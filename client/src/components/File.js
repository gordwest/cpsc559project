import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import downloadjs from 'downloadjs';
import { downloadFile, deleteFile } from "../server_api";

// const MONGO_URI = 'https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint';

function File(props) {

    const handleDownloadClick = async () => {
        downloadFile(props.name)
        .then ( (response) => { downloadjs(response.data.file, props.name) } )
        .catch ( (err) => { console.log(err) } )
    };

    const handleDeleteClick = async () => {
      deleteFile(props.name)
      .then ( (response) => { console.log(response, props.name) } )
      .catch ( (err) => { console.log(err) } )
    };

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
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