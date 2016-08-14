import * as constants from "../constants";
import { Controller } from "../controller";
import * as qfs from "../qfs";
import koa = require("koa");
import path = require("path");

export class StaticController extends Controller {
	constructor (ctx: koa.Context) {
		super(ctx);
	}

	public async index() {
		this.ctx.body = await qfs.readFile(path.join(constants.STATIC_PATH, this.ctx.parsedUrl.staticPath));
	}
}
