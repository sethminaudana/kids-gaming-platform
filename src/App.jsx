import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import NOGOGame from './pages/NOGOGame'

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container as="main" className="flex-grow-1 py-4">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="nogo-game" element={<NOGOGame />} />
      </Route>
    </Routes>
  );
}