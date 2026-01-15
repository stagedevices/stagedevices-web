import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/ibm-plex-mono";
import "./styles.css";
import App from "./App";
import { installAccentCursorDot } from "./lib/accentCursor";
import { installPixelHalftoneBackground } from "./lib/pixelHalftoneBackground";

const root = ReactDOM.createRoot(document.getElementById("root")!);

installAccentCursorDot();
const cleanupPixelHalftone = installPixelHalftoneBackground();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupPixelHalftone();
  });
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
