import * as koa from "koa";
import * as constants from "./constants";
import * as handlebars from "handlebars";
import * as Q from "q";
import * as qfs from "./qfs";
import * as path from "path";
import { HttpError } from "./utils/errors";
import { hashCode } from "./utils/string";
import { isDevEnv } from "./utils/core";

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
	protected async getTemplateString(name: string) {
		return qfs.readFile(this.getTemplatePath(name));
	}

	protected getTemplatePath(name: string) {
		return path.join(constants.TEMPLATE_PATH, name);
	}

	protected makeReplacements(string: string, replacements: { [find: string]: any }) {
		Object.keys(replacements).forEach(k => {
			string = string.split(k).join(String(replacements[k]));
		});
		return string;
	}

	public async render(layoutName: string, replacements: { [find: string]: any } = {}) {
		const template = await this.getTemplateString(layoutName);
		super.render(this.makeReplacements(template, replacements));
	}
}

export class TemplateCache {
	private static instance: TemplateCache;
	private hashCache: { [templateHash: number]: HandlebarsTemplateDelegate } = {};
	private pathCache: { [templatePath: string]: HandlebarsTemplateDelegate } = {};

	private constructor() {	}
	public static getInstance() {
		if (!TemplateCache.instance) {
			TemplateCache.instance = new TemplateCache();
		}
		return TemplateCache.instance;
	}
	public setTemplate(templatePath: string, template: HandlebarsTemplateDelegate): void;
	public setTemplate(templateHash: number, template: HandlebarsTemplateDelegate): void;
	public setTemplate(key: string | number, template: HandlebarsTemplateDelegate) {
		if (typeof key === "string") {
			this.pathCache[key] = template;
		} else {
			this.hashCache[key] = template;
		}
	}

	public getTemplate(templatePath: string): HandlebarsTemplateDelegate;
	public getTemplate(templateHash: number): HandlebarsTemplateDelegate;
	public getTemplate(key: string | number) {
		if (typeof key === "string") {
			return this.pathCache[key];
		} else {
			return this.hashCache[key];
		}
	}
}

export class HandlebarsView extends TemplatedView {
	protected getTemplatePath(name: string) {
		return super.getTemplatePath(path.join("handlebars", name));
	}
	public async render(layoutName: string, replacements: { [find: string]: any } = {}) {
		const templateCache = TemplateCache.getInstance();
		let templateDelegate = templateCache.getTemplate(layoutName);
		if (!templateDelegate || isDevEnv()) {
			const templateStr = await super.getTemplateString(layoutName);
			templateDelegate = handlebars.compile(templateStr);
			templateCache.setTemplate(layoutName, templateDelegate);
			templateCache.setTemplate(hashCode(templateStr), templateDelegate);
		}
		this.ctx.body = templateDelegate(replacements);
	}
}
