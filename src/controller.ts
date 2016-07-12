import koa = require("koa");

export class Controller {
	constructor(protected ctx: koa.Context) {

	}

	public async dispatchAction(action: string) {
		if (typeof (<any>this)[action] === "function") {
			await (<any>this)[action]();
		} else {
			throw new Error(`Action ${action} not found on ${this.constructor.name}`)
		}
	}
}
