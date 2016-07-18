import * as bodyParser from "koa-bodyparser";
import * as bootstrap from "./bootstrap";
import * as Constants from "./constants";
import * as dispatcher from "./dispatcher";
import * as jwt from "jsonwebtoken";
import * as koa from "koa";
import * as koaRouter from "koa-router";
import * as mssql from "mssql";
import { getBroomstackOverrides } from "./overrides";
import { PatService } from "./pat";
import * as Q from "q";
import * as sql from "./sql";
import * as tokenValidator from "./tokenvalidator";
import * as ctxUtils from "./utils/context";
import { HttpError } from "./utils/errors";

declare module "koa" {
	interface Request {
		body?: { [key: string]: any } | string;
	}

	interface IMiddleware {
		(ctx: koa.Context, next: Function): any;
	}
}

class TheBroomStack {
	private _publicKey: string;
	private _privateKey: string;
	private _koaApp: koa;
	private _router: koaRouter;

	private authenticate: koaRouter.IMiddleware;

	constructor() {

	}

	public get publicKey() {
		return this._publicKey;
	}

	public get privateKey() {
		return this._privateKey;
	}

	public get koa() {
		return this._koaApp;
	}

	public get router() {
		return this._router;
	}

	public async init() {
		const keys = await bootstrap.getKeys();

		({ public: this._publicKey, private: this._privateKey } = keys);
		this._koaApp = new koa();
		this._router = new koaRouter();
		this.authenticate = tokenValidator(this.publicKey);
		//this.setupRoutes();
		await this.setupMiddleware();
	}

	private getContextVerifier(): koa.IMiddleware {
		return async (ctx, next) => {
			ctxUtils.checkReq(ctx);
			ctxUtils.checkRes(ctx);
			if (typeof next === "function") {
				await next();
			}
		}
	}

	private async setupMiddleware() {
		this.koa.use(this.getContextVerifier());
		this.koa.use(<koa.IMiddleware>getBroomstackOverrides().routes());
		this.koa.use(bodyParser());
		this.koa.use(sql.connectSql(await bootstrap.getConnectionInfo()));
		const theBroomstackDispatcher = new dispatcher.Dispatcher({
			controllersPath: Constants.CONTROLLER_PATH
		});

		// Dispatcher
		this.koa.use(theBroomstackDispatcher.getDispatcher());
	}

	private setupRoutes() {

		this.router.get("/login", async (ctx, next) => {
			const token = jwt.sign({user: "trevorsg"}, this._privateKey, { algorithm: "RS256", expiresIn: "24h", notBefore: "1h" });
			ctx.body = token;
		});

		this.router.get("/hello", this.authenticate, async (ctx, next) => {
			if (next) {
				await next();
			}
			ctx.body = "Waving hello.";
		});

		this.router.post("/person", async(ctx, next) => {
			if (ctx.request && ctxUtils.isJsonBody(ctx.request.body) && ctx.request.body["displayname"]) {
				const request = new ctx.sqlConnection.Request();
				await request
					.input("displayname", ctx.request.body["displayname"])
					.input("firstname", ctx.request.body["firstname"])
					.input("lastname", ctx.request.body["lastname"])
					.output("id")
					.execute("prc_AddPerson");

				console.log("Added person: " + request.parameters.id.value);

				if (!ctx.response) {
					throw new HttpError(500, "No body in koa context.");
				}
				ctx.response.body = `Hello, ${request.parameters.id.value}!`;
			} else {
				throw new Error("A person requires a display name.");
			}
		});
	}
}

const app = new TheBroomStack();
app.init().then(() => {
	app.koa.listen(3000);
});
