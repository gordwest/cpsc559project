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
        <Container className="mt-5 mb-5">
            <Row class="file_upload_bar">
                <FileUpload/>
            </Row>
        </Container>
        <Container class="file_format">
            <Row class="file_format_row" className="justify-content-md-evenly justify-content-center">
                { files.map(file => <File key={file._id} file={file}/>)} {/* last 3+ files */}
            </Row>
        </Container>
    </div>
  );
}

export default Home;