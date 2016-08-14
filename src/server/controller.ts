import koa = require("koa");
import * as view from "./view";
import {UrlParts} from "./dispatcher";

// Augment koa.Context to include parsedUrl
declare module "koa" {
	interface Context {
		parsedUrl: UrlParts;
	}
}

export abstract class Controller {
	protected view: view.BaseView;
	constructor(protected ctx: koa.Context) {

	}

	public async dispatchAction(action: string) {
		if (typeof (<any>this)[action] === "function") {
			await (<any>this)[action]();
		} else {
			throw new Error(`Action ${action} not found on ${this.constructor.name}`);
		}
	}

	protected getView(): view.BaseView {
		if (!this.view) {
			this.view = new view.EmptyView(this.ctx);
		}
		return this.view;
	}
}
