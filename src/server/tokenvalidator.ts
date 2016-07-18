import { HttpError } from "./utils/errors"

import * as ctxUtils from "./utils/context";
import jwt = require("jsonwebtoken");
import koa = require("koa");
import * as koaRouter from "koa-router";

const validator = function(key: string): koaRouter.IMiddleware {
	return async (ctx: koaRouter.IRouterContext, next: () => any) => {
		if (!ctx.req) {
			throw new HttpError(500, "No request object in koa context.");
		}
		const authHeader: string = ctx.req.headers["authorization"];
		if (authHeader) {
			const [type, token] = authHeader.split(" ");
			if (type === "Bearer") {
				if (jwt.verify(token, key)) {
					console.log("validated");
					await next();
				} else {
					ctx.throw(401, "Not authorized.");
				}
			} else {
				ctx.throw(401, "Unsupported authorization.");
			}
		} else {
			ctx.throw(401, "No auth header.");
		}
	};
}


export = validator;
