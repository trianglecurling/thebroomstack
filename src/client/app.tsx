require("./styles/thebroomstack.scss");
require("./styles/lib/ionicons.scss");

import * as Navigation from "./navigation";
import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";

export var NavigationData = require<Navigation.NavigationItem[]>("./data/navigation.json");
setTimeout(() => {
	NavigationData[2].childItems![1].selected = true;
}, 5000);

export class TheBroomStack {
	public start() {
		this.welcome();
		this.initEventListeners();
	}

	public initEventListeners() {
		document.addEventListener("DOMContentLoaded", () => {
			ReactDOM.render(<Navigation.Navigation items={NavigationData} />, document.getElementById("app"));
		});
	}

	/**
	 * Welcome developers with a console message.
	 */
	public welcome() {
		console.log(`Hello, and thank you for your interest in this curling website. We are running TheBroomStack, a dedicated curling management system. For details, check us out on GitHub at https://github.com/trevorsg/TheBroomStack. Thanks!`);
	}
}

(function() {
	const app = new TheBroomStack();
	app.start();
})();
