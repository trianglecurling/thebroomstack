import _ = require("lodash");
import controller = require("./controller");
import koa = require("koa");
import path = require("path");
import qfs = require("./qfs");
import url = require("url");

interface UrlParts {
	full: string;
	protocol: string;
	host: string;
	hostname: string;
	subdomain: string;
	port: number;
	path: string;
	query: string;
	controller: string;
	action: string;
	staticPath: boolean;
	apiPath: boolean;
	params: { [key: string]: string };
}

export interface DispatcherConfig {
	defaultController?: string;
	defaultAction?: string;
	controllersPath: string;
}

// Augment koa.Context to include parsedUrl
declare module "koa" {
	interface Context {
		parsedUrl: UrlParts;
	}
}

export class Dispatcher {

	constructor(public config: DispatcherConfig) {
		if (!config.defaultAction) {
			config.defaultAction = "index";
		}
		if (!config.defaultController) {
			config.defaultController = "home";
		}
	}

	public getDispatcher() {
		return async (ctx: koa.Context, next: Function) => {
			const parsedUrl = this.parseUrl(ctx.request.header.host + ctx.request.url);
			ctx.parsedUrl = parsedUrl;
			const controller = await this.controllerFactory(parsedUrl.controller, ctx);
			await controller.dispatchAction(parsedUrl.action);
			await next();
		};
	}

	private async controllerFactory(controllerName: string, ctx: koa.Context): Promise<controller.Controller> {
		const controllerClass = this.controllerClassName(controllerName);
		const controllerPath = path.join(this.config.controllersPath, controllerClass);
		if (await qfs.exists(controllerPath)) {
			const controllerModule = require(controllerPath);

			if (controllerModule[controllerClass]) {
				const controller = new controllerModule[controllerClass](ctx);
				return controller;
			} else {
				throw new Error(`No exported member ${controllerClass} in ${controllerPath}.`);
			}
		} else {
			throw new Error("Could not find controller class: " + controllerPath);
		}
	}

	private controllerClassName(controllerName: string) {
		return _.capitalize(controllerName) + "Controller.js";
	}

	private parseUrl(urlStr: string) {
		const nodeUrl = url.parse(urlStr, true);
		const pathParts = nodeUrl.pathname.split("/");

		// Special paths
		let apiPath = false;
		let staticPath = false;
		if (pathParts[0] === "_apis") {
			apiPath = true;
			pathParts.shift();
		} else if (pathParts[0] === "_static") {
			staticPath = true;
			pathParts.shift();
		}

		// Subdomain
		const hostnameParts = nodeUrl.hostname.split(".");
		let subdomain: string = null;
		if (hostnameParts.length > 2) {
			subdomain = hostnameParts.slice(0, hostnameParts.length - 2).join(".");
		}

		// Controller & action
		let controller: string = null;
		let action: string = null;
		if (!staticPath) {
			if (pathParts.length > 0) {
				controller = pathParts[0];
			} else {
				controller = this.config.defaultController;
			}
			if (pathParts.length > 1) {
				action = pathParts[1];
			} else {
				action = this.config.defaultAction;
			}
		}

		// Parameters
		let params: { [key: string]: string } = { };
		if (!staticPath && pathParts.length > 2) {
			for (const part of pathParts.slice(2)) {
				const colonIndex = part.indexOf(":");
				const key = part.substr(0, colonIndex);
				const value = part.substr(colonIndex + 1);
				params[key] = value;
			}
		}
		_.assign(params, nodeUrl.query);

		return {
			full: nodeUrl.href,
			protocol: nodeUrl.protocol,
			host: nodeUrl.host,
			hostname: nodeUrl.hostname,
			subdomain: subdomain,
			port: parseInt(nodeUrl.port),
			path: nodeUrl.pathname,
			query: nodeUrl.search,
			controller: controller,
			action: action,
			staticPath: staticPath,
			apiPath: apiPath,
			params: params
		};
	}
}
