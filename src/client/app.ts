require("./styles/thebroomstack.scss");
import * as _ from "lodash";

export class TheBroomStack {
	public start() {
		this.welcome();
		this.initEventListeners();
	}

	public initEventListeners() {
		document.addEventListener("DOMContentLoaded", () => {

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
