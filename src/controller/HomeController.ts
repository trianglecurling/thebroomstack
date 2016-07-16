import { Controller } from "../controller";
import * as view from "../view";
import koa = require("koa");

export class HomeController extends Controller {
	protected view: view.TemplatedView;
	constructor (ctx: koa.Context) {
		super(ctx);
		this.view = new view.TemplatedView(ctx);
	}

	public async index() {
		this.ctx.body = JSON.stringify(this.ctx, null, 4);
	}

	public async test() {
		await this.getView().render("html/basic.html", {
			"{{title}}": "This is the title",
			"{{body}}": "This is the body"
		});
	}

	protected getView(): view.TemplatedView {
		if (!this.view) {
			this.view = new view.TemplatedView(this.ctx);
		}
		return this.view;
	}
}
