import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import File from "./components/File";
import FileUpload from "./components/FileUpload";
import { retreiveFiles } from "./api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Home() {

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshFiles()
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);
    
    async function refreshFiles() {
        try {
            const response = await retreiveFiles();
            setFiles(response.files)
        } catch (err) {
          console.log(err)
        }
      }


  return (
    <div onLoad= {() => refreshFiles()}>
        <NavBar/>
        <Container>
        <FileUpload/>
        </Container>
        <Container >
            <Row>
                <Col>
                    { files.slice(0,3).map(file => <File key={file._id} file={file}/>)} {/* first 3 files */}
                </Col>
                <Col>
                    { files.slice(3, 5).map(file => <File key={file._id} file={file}/>)} {/* next 3 files */}
                </Col>
                <Col>
                    { files.slice(5, files.length).map(file => <File key={file._id} file={file}/>)} {/* last 3+ files */}
                </Col>
            </Row>
        </Container>
    </div>
  );
}

export default Home;