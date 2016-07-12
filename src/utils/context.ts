import * as koa from "koa";
import * as http from "http";
import { HttpError } from "./errors";

export function checkReq(ctx: koa.Context) {
	if (!ctx.req || !ctx.request) {
		throw new HttpError(500, "No request object in koa context.");
	}
}

export function checkRes(ctx: koa.Context) {
	if (!ctx.res || !ctx.response) {
		throw new HttpError(500, "No response object in koa context.");
	}
}

export function isTextBody(body: { [key: string]: any } | string | undefined): body is string {
	return typeof body === "string";
}

export function isJsonBody(body: { [key: string]: any } | string | undefined): body is { [key: string]: any } {
	return _.isObject(body);
}
