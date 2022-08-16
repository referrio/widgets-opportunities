import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Required Import
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

// Find all widget divs
const WidgetTargets = document.querySelectorAll(
  ".referrio-embed-widget-opportunities"
);

// Inject our React App into each
WidgetTargets.forEach((Div) => {
  const element = ReactDOM.createRoot(Div);
  element.render(
    <React.StrictMode>
      <App domElement={Div} />
    </React.StrictMode>
  );
});
