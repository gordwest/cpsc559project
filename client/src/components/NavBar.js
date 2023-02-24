import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import filepng from '../assets/filegreen.png';

const title = {
  fontSize : '48px',
  fontWeight: '800',
  color: '#4AF626',
}

const bar = {
    background: '#000000',
    boxShadow: '0 4px 8px 0 #4AF626',
}

const icon = {
    height: '3.5rem',
    paddingRight: '1.5rem',
}

function NavBar() {
  return (
    <Navbar style={bar} variant="dark">
        <Container>
          <Navbar.Brand style={title}>
          <img src={filepng} style={icon}/>
            Doogle Grive
          </Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default NavBar;