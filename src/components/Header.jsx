import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="font-fredoka text-warning-dark fw-bold fs-3"
        >
          🎯 FunZone Arcade
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="fw-bold fs-5">
              🏠 Home
            </Nav.Link>
            <Nav.Link as={Link} to="/nogo-game" className="fw-bold fs-5">
              🚦 NO GO Game
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="fw-bold fs-5">
              ℹ️ About Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}