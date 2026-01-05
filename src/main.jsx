import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Import our global styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./public/css/style.css";
import "./public/css/bootstrap.min.css";
import "./public/lib/animate/animate.min.css";
import "./public/lib/lightbox/css/lightbox.min.css";
import "./public/lib/owlcarousel/assets/owl.carousel.min.css";
import "./public/css/bootstrap.min.css";
import "./public/css/style.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
