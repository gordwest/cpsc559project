import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const title = {
  fontSize : '36px'
}

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={title}>
            Doogle Grive
          </Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default NavBar;