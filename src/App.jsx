import React, { useRef } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap"; // Import Container
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Game from "./components/Game";
import GemMatchGame from "./components/GemMatchGame";
import BlueprintGame from "./components/BlueprintGame";
import MemoryGame from "./MemoryGame/MemoryGame";


// This is our main layout component
function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      {/* Container centers our content and makes it responsive */}
      <Container as="main" className="flex-grow-1 py-4">
        <Outlet /> {/* Pages (Home, About) will be rendered here */}
      </Container>

      <Footer />
    </div>
  );
}

// This is where we define our routes (no change here)
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="gem-match" element={<GemMatchGame />} />
        <Route path="blueprint-builder" element={<BlueprintGame />} />
        <Route path='memorygame' element = {<MemoryGame/>} />
      </Route>
      {/* <Route path="/magic-gems" element={<Game />} /> */}
    </Routes>
  );
}
