import React, { useState } from "react";
import axios from "axios";
// import './App.css';
import NavBar from "./components/NavBar";
import File from "./components/File";
import FileUpload from "./components/FileUpload";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const MONGO_URI = 'https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint';

const center = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
};


function Home() {

    const [files, setFiles] = useState([]);

    async function refreshFiles() {
        try {
            const response = await axios.get(MONGO_URI + '/files');
            console.log(response.data)
            console.log(response.data[0])
            setFiles(response.data)
        } catch (err) {
          console.log(err)
        }
        setTimeout(() => {
            refreshFiles();
        }, 5000);
      }


  return (
    <div onLoad= {() => refreshFiles()}>
        <NavBar/>
        <Container>
            <Row>
                <Button onClick={() => refreshFiles()}>
                    Refresh Files
                </Button>
            </Row>
        <FileUpload/>
        </Container>
        <Container style={center}>
            <Row>
                <Col>
                    { files.map(file => <File name={file.name}/>)}
                </Col>
            </Row>
        </Container>
    </div>
  );
}

export default Home;