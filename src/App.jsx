import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the components created in previous steps
import Service from './template/Service';
import Program from './template/Program';
import Event from './template/Event';
import Blog from './template/Blog';
import Testimonial from './template/Testimonial';
import Contact from './template/Contact';
import About from './template/About';


// Assuming you have these components (or placeholders)
import Header from './components/Header'; 
import Footer from './components/Footer';
import Home from './template/Home'; // A landing page combining these sections

// import React, { useRef } from "react";
// import { Routes, Route, Outlet } from "react-router-dom";
// import { Container } from "react-bootstrap";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import About from "./pages/About";
import NOGOGame from './pages/NOGOGame'
import Game from "./components/Game";
import GemMatchGame from "./components/GemMatchGame";
import BlueprintGame from "./components/BlueprintGame";
import MemoryGame from "./MemoryGame/MemoryGame";



function App() {
  return (
    <Router>
      {/* Header stays consistent across all routes */}
      <Header />

      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Pages based on your created components */}
        <Route path="/service" element={<Service />} />
        <Route path="/programs" element={<Program />} />
        <Route path="/events" element={<Event />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="nogo-game" element={<NOGOGame />} />
         <Route path="game" element={<Game />} />
         {/* <Route path="gem-match" element={<GemMatchGame />} /> */}
        {/* <Route path="blueprint-builder" element={<BlueprintGame />} /> */}
         <Route path='memorygame' element = {<MemoryGame/>} />


        {/* 404 Fallback */}
        <Route path="*" element={<div className="text-center py-5"><h1>404 - Page Not Found</h1></div>} />
      </Routes>

      {/* Footer stays consistent across all routes */}
      <Footer />
    </Router>
  );
}

export default App;








// function Layout() {
//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <Header />
//       <Container as="main" className="flex-grow-1 py-4">
//         <Outlet />
//       </Container>
//       <Footer />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<Home />} />
//         <Route path="about" element={<About />} />
//         <Route path="nogo-game" element={<NOGOGame />} />
//         <Route path="game" element={<Game />} />
//         <Route path="gem-match" element={<GemMatchGame />} />
//         <Route path="blueprint-builder" element={<BlueprintGame />} />
//         <Route path='memorygame' element = {<MemoryGame/>} />
//       </Route>
//       {/* <Route path="/magic-gems" element={<Game />} /> */}
//     </Routes>
//   );
// }