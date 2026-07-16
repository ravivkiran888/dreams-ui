import React from 'react';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <BootstrapNavbar bg="primary" variant="dark" expand="lg">
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/option-chain">
              Option Chain
            </Nav.Link>
          </Nav>
        
        </BootstrapNavbar.Collapse>
      </BootstrapNavbar>
      <br />
    </>
  );
};

export default Navbar;
