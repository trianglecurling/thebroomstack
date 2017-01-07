import { Controller } from "../controller";
import { HandlebarsView } from "../view";
import koa = require("koa");
import * as React from "react";
import { renderToString } from "react-dom/server";

import { match, RouterContext } from "react-router";
import Routes from "../../shared/routes";

//import Shell from "../view/shell";

export class HomeController extends Controller {
	protected view: HandlebarsView;
	constructor (ctx: koa.Context) {
		super(ctx);
		this.view = new HandlebarsView(ctx);
	}

	public async index() {
		return new Promise((resolve, reject) => {
			match({
				routes: Routes,
				location: this.ctx.req.url
			}, async (err, redirect, props) => {
				const body = renderToString(React.createElement(RouterContext, props));
				await this.getView().render("basic.html", {
					title: "This is the title",
					body: body
				});
				resolve();
			});
		});
	}

	public async test() {
		await this.getView().render("basic.html", {
			title: "Test page, please ignore",
			body: "This is the body"
		});
	}

	protected getView(): HandlebarsView {
		if (!this.view) {
			this.view = new HandlebarsView(this.ctx);
		}
		return this.view;
	}
}
