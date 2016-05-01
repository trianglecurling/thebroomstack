import jwt = require("jsonwebtoken");
import koa = require("koa");

const validator = function(key: string)  {
	return async (ctx: koa.Context, next: Function) => {
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
