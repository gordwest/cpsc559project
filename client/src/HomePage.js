import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import File from "./components/File";
import FileUpload from "./components/FileUpload";
import { retreiveFiles } from "./api";
import Container from 'react-bootstrap/Container';

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
            <div class="file_upload_bar">
                <FileUpload/>
            </div>
        </Container>
        <Container>
            <div class="file_format">
                { files.map(file => <File key={file._id} file={file}/>)}
            </div>
        </Container>
    </div>
  );
}

export default Home;