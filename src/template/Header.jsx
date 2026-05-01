import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import "animate.css"; // Import the animation styles
import { WOW } from "wowjs"; // Import the animation logic
import logoImg from '../assets/logochild.png';

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
        <div className="container-fluid border-bottom bg-light " >
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
                <nav className="navbar navbar-light navbar-expand-lg pt-4">
    {/* 1. Logo (Always First) */}
    <a href="/" className="navbar-brand d-flex align-items-center order-1">
        <img src={logoImg} alt="ChildCare Logo" style={{ height: '50px', width: 'auto' }} className="me-2" />
        <h1 className="text-primary display-6 mb-0">Child<span className="text-secondary">Care</span></h1>
    </a>

    {/* 2. Login & Hamburger Menu (Always Right on Mobile, Far Right on Desktop) */}
    <div className="d-flex align-items-center order-2 order-lg-3">
        <NavLink to="/login" className="btn btn-primary rounded-pill px-3 me-2 d-flex align-items-center">
            <i className="fas fa-sign-in-alt me-2"></i> Log In
        </NavLink>
        <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars text-primary"></span>
        </button>
    </div>

    {/* 3. The Collapsed Content (Drops to bottom on Mobile, Middle on Desktop) */}
    <div className="collapse navbar-collapse order-3 order-lg-2" id="navbarCollapse">
        {/* Navigation Links */}
        <div className="navbar-nav mx-auto">
            <NavLink to="/" className="nav-item nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-item nav-link">About</NavLink>
            <NavLink to="/service" className="nav-item nav-link">Services</NavLink>
            <NavLink to="/games" className="nav-item nav-link">Games</NavLink>
            <NavLink to="/event" className="nav-item nav-link">Events</NavLink>
            <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                    <NavLink to="/blog" className="dropdown-item">Our Blog</NavLink>
                    <NavLink to="/testimonial" className="dropdown-item">Testimonial</NavLink>
                </div>
            </div>
            <NavLink to="/contact" className="nav-item nav-link">Contact</NavLink>
        </div>
        
        {/* Phone Number & Search Button */}
        {/* <div className="d-flex flex-column flex-lg-row align-items-center me-lg-4 mt-3 mt-lg-0">
            <div id="phone-tada" className="d-flex align-items-center justify-content-center">
                <a href="#" className="position-relative">
                    <i className="fa fa-phone-alt text-primary fa-2x me-4"></i>
                    <div className="position-absolute" style={{ top: "-7px", left: "20px" }}>
                        <span><i className="fa fa-comment-dots text-secondary"></i></span>
                    </div>
                </a>
            </div>
            <div className="d-flex flex-column pe-3 border-end border-primary me-3">
                <span className="text-primary">Have any questions?</span>
                <a href="#"><span className="text-secondary">Free: + 0123 456 7890</span></a>
            </div>
            <button className="btn-search btn btn-primary btn-md-square rounded-circle mt-3 mt-lg-0" data-bs-toggle="modal" data-bs-target="#searchModal">
                <i className="fas fa-search text-white"></i>
            </button>
        </div> */}
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