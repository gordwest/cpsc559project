import React, { useEffect, useState } from "react";
import axios from "axios";
// import './App.css';
import NavBar from "./components/NavBar";
import File from "./components/File";
import FileUpload from "./components/FileUpload";
import { retreiveFiles } from "./api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// import { response } from "express";

const MONGO_URI = 'https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint';
const SERVER_URI = 'http://localhost:1111/';

const center = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
};

function Home() {

    const [files, setFiles] = useState([]);

    useEffect(() => {
  const intervalId = setInterval(() => {
    retreiveFiles()
    //   .then(response => setFiles(response.data.files))
    //   .catch(err => console.log(err));
  }, 5000);
  return () => clearInterval(intervalId);
}, []);
    
    async function refreshFiles() {
        try {
            const response = await retreiveFiles();

            // console.log(response.data)
            // console.log(response.data[0])
            setFiles(response.data.files)

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