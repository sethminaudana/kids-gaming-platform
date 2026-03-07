import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

export default function Header() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // 1. Helper function to read the token
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // JWTs have 3 parts separated by dots. The middle part has the data!
        // 'atob' decodes it from base64 so we can read the username.
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username);
      } catch (e) {
        console.error("Invalid token format");
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  };

  // 2. Run this when the Navbar loads, and listen for our custom signal
  useEffect(() => {
    checkAuth(); // Check immediately on load
    window.addEventListener("authChange", checkAuth); // Listen for logins/logouts
    
    // Cleanup listener when component unmounts
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  // 3. The Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Throw away the VIP wristband
    window.dispatchEvent(new Event("authChange")); // Signal the Navbar to update
    navigate("/login"); // Redirect to the login page
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="font-fredoka text-warning-dark">
          FunZone Arcade
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="fw-bold">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="fw-bold me-3">About Us</Nav.Link>
            
            {/* 4. CONDITIONAL RENDERING: Show different buttons based on auth state */}
            {username ? (
              <>
                <span className="fw-bold text-success me-3">🎮 Hi, {username}!</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="fw-bold rounded-pill px-3">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm" className="fw-bold rounded-pill px-3 me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="warning" size="sm" className="fw-bold rounded-pill px-3">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import "animate.css"; // Import the animation styles
import { WOW } from "wowjs"; // Import the animation logic


export default function Header() {

  // 1. STATE: Control whether the spinner is visible
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2. SPINNER LOGIC: Wait 2 seconds, then hide spinner
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 2000ms = 2 seconds

    // 3. ANIMATION LOGIC: Initialize WOW.js
    const wow = new WOW({ live: false });
    wow.init();

    return () => clearTimeout(timer); // Cleanup timer if component unmounts
  }, []);


  return (
   <>
       {/* --- SPINNER SECTION --- */}
      {/* We use a conditional check: Only show this div if isLoading is TRUE */}
      {isLoading && (
        <div
          id="spinner"
          className="show w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999 }} // Ensure it sits on top of everything
        >
          <div className="spinner-grow text-primary" role="status"></div>
        </div>
      )}


        {/* Removed 'wow fadeIn' class so content is visible */}
        <div className="container-fluid border-bottom bg-light wow fadeIn" data-wow-delay="0.1s">
            {/* <div className="container topbar bg-primary d-none d-lg-block py-2" style={{ borderRadius: "0 40px" }}>
                <div className="d-flex justify-content-between">
                    <div className="top-info ps-2">
                        <small className="me-3"><i className="fas fa-map-marker-alt me-2 text-secondary"></i> <a href="#" className="text-white">123 Street, New York</a></small>
                        <small className="me-3"><i className="fas fa-envelope me-2 text-secondary"></i><a href="#" className="text-white">Email@Example.com</a></small>
                    </div>
                    <div className="top-link pe-2">
                        <a href="" className="btn btn-light btn-sm-square rounded-circle"><i className="fab fa-facebook-f text-secondary"></i></a>
                        <a href="" className="btn btn-light btn-sm-square rounded-circle"><i className="fab fa-twitter text-secondary"></i></a>
                        <a href="" className="btn btn-light btn-sm-square rounded-circle"><i className="fab fa-instagram text-secondary"></i></a>
                        <a href="" className="btn btn-light btn-sm-square rounded-circle me-0"><i className="fab fa-linkedin-in text-secondary"></i></a>
                    </div>
                </div>
            </div> */}
            <div className="container px-0">
                <nav className="navbar navbar-light navbar-expand-xl py-3">
                    <a href="/" className="navbar-brand"><h1 className="text-primary display-6">Child<span className="text-secondary">Arena</span></h1></a>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-primary"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <Link to="/" className="nav-item nav-link active">Home</Link>
                            <Link to="/about" className="nav-item nav-link">About</Link>
                            {/* <Link to="/service" className="nav-item nav-link">Services</Link>
                            <Link to="/programs" className="nav-item nav-link">Programs</Link> */}
                            <Link to="/events" className="nav-item nav-link">Games</Link>
                            <Link to="/blog" className="nav-item nav-link">Blog</Link>
                            <Link to="/contact" className="nav-item nav-link">Contact</Link>

                            {/* <a href="index.html" className="nav-item nav-link active">Home</a>
                            <a href="about.html" className="nav-item nav-link">About</a>
                            <a href="service.html" className="nav-item nav-link">Services</a>
                            <a href="program.html" className="nav-item nav-link">Programs</a>
                            <a href="event.html" className="nav-item nav-link">Events</a> */}
                            {/* <div className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                                    <a href="blog.html" className="dropdown-item">Our Blog</a>
                                    <a href="team.html" className="dropdown-item">Our Team</a>
                                    <a href="testimonial.html" className="dropdown-item">Testimonial</a>
                                    <a href="404.html" className="dropdown-item">404 Page</a>
                                </div>
                            </div> */}
                            {/* <a href="contact.html" className="nav-item nav-link">Contact</a>
                            <a href="contact.html" className="nav-item nav-link">Blog</a> */}
                        </div>
                        <div className="d-flex me-4">
                            <div id="phone-tada" className="d-flex align-items-center justify-content-center">
                                {/* Removed 'wow tada' class */}
                                <a href="" className="position-relative" data-wow-delay=".9s" >
                                    <i className="fa fa-phone-alt text-primary fa-2x me-4"></i>
                                    <div className="position-absolute" style={{ top: "-7px", left: "20px" }}>
                                        <span><i className="fa fa-comment-dots text-secondary"></i></span>
                                    </div>
                                </a>
                            </div>
                            <div className="d-flex flex-column pe-3 border-end border-primary">
                                <span className="text-primary">Have any questions?</span>
                                <a href="#"><span className="text-secondary">Free: + 0123 456 7890</span></a>
                            </div>
                        </div>
                        <button className="btn-search btn btn-primary btn-md-square rounded-circle" data-bs-toggle="modal" data-bs-target="#searchModal"><i class="fas fa-search text-white"></i></button>
                    </div>
                </nav>
            </div>
        </div>
        
        <div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Search by keyword</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body d-flex align-items-center">
                        <div className="input-group w-75 mx-auto d-flex">
                            <input type="search" className="form-control p-3" placeholder="keywords" aria-describedby="search-icon-1"/>
                            <span id="search-icon-1" className="input-group-text p-3"><i className="fa fa-search"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    // <Navbar bg="light" expand="lg" className="shadow-sm">
    //   <Container>
    //     <Navbar.Brand
    //       as={Link}
    //       to="/"
    //       className="font-fredoka text-warning-dark fw-bold fs-3"
    //     >
    //       🎯 FunZone Arcade
    //     </Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className="ms-auto">
    //         <Nav.Link as={Link} to="/" className="fw-bold fs-5">
    //           🏠 Home
    //         </Nav.Link>
    //         <Nav.Link as={Link} to="/nogo-game" className="fw-bold fs-5">
    //           🚦 NO GO Game
    //         </Nav.Link>
    //         <Nav.Link as={Link} to="/about" className="fw-bold fs-5">
    //           ℹ️ About Us
    //         </Nav.Link>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
  );
}