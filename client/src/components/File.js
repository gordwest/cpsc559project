import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import downloadjs from 'downloadjs';
import { downloadFile, deleteFile } from "../api";
import './File.css';
import filepng from '../assets/file.png';

const icon = {
    height: '1.3rem',
    paddingRight: '0.5rem',
    alignContent: 'center',
}

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
    <Card className="card mt-3 mb-3 ms-3 me-3 file" style={{ width: '18rem', padding: '1rem'}}>
    <Card.Title className="file_card_title" >
        <img src={filepng} style={icon}/>
        {props.file.name}
        </Card.Title>
      <Card.Body>
        <div id="file_card_button_row">
          <Button className="buttonz" size="md" onClick={() => handleDownloadClick()}>
              Download
          </Button>
          <Button className="buttonz" size="md" onClick={() => handleDeleteClick()}>
              Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default File;