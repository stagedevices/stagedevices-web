import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/ibm-plex-mono";
import "./styles.css";
import App from "./App";
import { installAccentCursorDot } from "./lib/accentCursor";
import { TuiProvider } from "./lib/tuiController";

const root = ReactDOM.createRoot(document.getElementById("root")!);

installAccentCursorDot();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TuiProvider>
        <App />
      </TuiProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
