import { Controller } from "../controller";
import { HandlebarsView } from "../view";
import koa = require("koa");

export class HomeController extends Controller {
	protected view: HandlebarsView;
	constructor (ctx: koa.Context) {
		super(ctx);
		this.view = new HandlebarsView(ctx);
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

	protected getView(): HandlebarsView {
		if (!this.view) {
			this.view = new HandlebarsView(this.ctx);
		}
		return this.view;
	}
}
