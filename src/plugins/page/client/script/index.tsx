import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { initializeIcons } from "@fluentui/react";
// import "sanitize.css";

// The published version of sanitize is missing some fixes.
import "../style/sanitize.css";

initializeIcons();

const root = document.getElementById("root");
if (root) {
	ReactDOM.render(<App />, root);
}