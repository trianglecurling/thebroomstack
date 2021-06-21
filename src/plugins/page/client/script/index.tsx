import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
// import "sanitize.css";

// The published version of sanitize is missing some fixes.
import "../style/sanitize.css";

const root = document.getElementById("root");
if (root) {
	ReactDOM.render(<App />, root);
}