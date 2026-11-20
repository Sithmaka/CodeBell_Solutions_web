import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { initializeAttribution } from "./lib/attribution";
import "./styles/global.css";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/reference.css";
import "./styles/motion.css";

initializeAttribution();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
