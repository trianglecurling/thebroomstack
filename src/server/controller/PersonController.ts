import { Controller } from "../controller";
import koa = require("koa");

export class PersonController extends Controller {
	constructor (ctx: koa.Context) {
		super(ctx);
	}

	public async index() {
		this.ctx.body += JSON.stringify(this.ctx, null, 4);

	}
}
