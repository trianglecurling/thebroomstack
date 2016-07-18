import { Controller } from "../controller";
import * as view from "../view";
import koa = require("koa");

export class HomeController extends Controller {
	protected view: view.HandlebarsView;
	constructor (ctx: koa.Context) {
		super(ctx);
		this.view = new view.HandlebarsView(ctx);
	}

	public async index() {
		this.ctx.body = JSON.stringify(this.ctx, null, 4);
	}

	public async test() {
		await this.getView().render("basic.html", {
			title: "This is the title",
			body: "This is the body"
		});
	}

	protected getView(): view.HandlebarsView {
		if (!this.view) {
			this.view = new view.HandlebarsView(this.ctx);
		}
		return this.view;
	}
}
