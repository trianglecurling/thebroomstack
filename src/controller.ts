import koa = require("koa");

export class Controller {
	constructor(private ctx: koa.Context) {

	}

	public dispatchAction(action: string) {
		if (typeof (<any>this)[action] === "function") {
			(<any>this)[action]();
		} else {
			throw new Error(`Action ${action} not found on ${this.constructor.name}`)
		}
	}
}
