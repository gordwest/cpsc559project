import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import downloadjs from 'downloadjs';
import { downloadFile, deleteFile } from "../api";
import Row from 'react-bootstrap/Row';
import './File.css';

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
    <Card border="primary" className="mt-4 mb-4" class="card mt-4 mb-4" style={{ width: '18rem', padding: '1rem'}}>
      <Card.Body>
        <Card.Title class="file_card_title" >{props.file.name}</Card.Title>
        <Row id="file_card_button_row">
          <Button size="md" onClick={() => handleDownloadClick()}>
              Download
          </Button>
          <Button size="md" onClick={() => handleDeleteClick()}>
              Delete
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default File;