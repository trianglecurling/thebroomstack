require("./styles/thebroomstack.scss");
require("./styles/lib/ionicons.scss");

import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Routes from "../shared/routes";

export class TheBroomStack {
	public start() {
		this.welcome();
		this.initEventListeners();
	}

	public initEventListeners() {
		document.addEventListener("DOMContentLoaded", () => {
			ReactDOM.render((
				<Router history={browserHistory} routes={Routes} />
			), document.getElementById("app"));
		});
	}

	/**
	 * Welcome developers with a console message.
	 */
	public welcome() {
		console.log(`Hello, and thank you for your interest in this curling website. We are running TheBroomStack, a dedicated curling management system. For details, check us out on GitHub at https://github.com/trianglecurling/TheBroomStack. Thanks!`);
	}
}

(function() {
	const app = new TheBroomStack();
	app.start();
})();
