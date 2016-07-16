import * as koa from "koa";
import * as constants from "./constants";
import * as Q from "q";
import * as qfs from "./qfs";
import * as path from "path";
import { HttpError } from "./utils/errors";

export abstract class BaseView {
	constructor(protected ctx: koa.Context) {

	}

	public abstract async render<T>(data?: T): Promise<void>;
}

export class EmptyView extends BaseView {
	public async render() {
		this.ctx.body = "";
	}
}

export class StringView extends BaseView {
	public async render(data: string) {
		this.ctx.body = data;
	}
}

export class JSONView extends StringView {
	public async render(data: any, compress: boolean = true) {
		try {
			this.ctx.response!.type = "application/json";
			super.render(JSON.stringify(data, null, compress ? undefined : 4));
		} catch (e) {
			throw new HttpError(500, "Could not stringify object. " + e.toString());
		}
	}
}

export class TemplatedView extends StringView {
	protected static templateDir = constants.TEMPLATE_PATH;

	protected async getTemplateString(name: string) {
		return qfs.readFile(this.getTemplatePath(name));
	}

	protected getTemplatePath(name: string) {
		return path.join(TemplatedView.templateDir, name);
	}

	protected makeReplacements(string: string, replacements: { [find: string]: string }) {
		Object.keys(replacements).forEach(k => {
			string = string.split(k).join(replacements[k]);
		});
		return string;
	}

	public async render(layoutName: string, replacements: { [find: string]: string } = {}) {
		const template = await this.getTemplateString(layoutName);
		super.render(this.makeReplacements(template, replacements));
	}
}
