import * as koa from "koa";
import { HttpError, NotAuthorizedError, ForbiddenError, NotFoundError } from "./utils/errors";

export function getErrorHandler() {
	return async (ctx: koa.Context, next: Function) => {
		try {
			await next();
		} catch (err) {
			if (err instanceof HttpError) {
				ctx.status = err.getStatusCode();
				ctx.body = err.message;
			} else {
				ctx.status = 500;
				ctx.body = err.message;
			}
			ctx.app.emit("error", err, koa);
		}
	}
}
