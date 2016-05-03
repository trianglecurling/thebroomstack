import bodyParser = require("koa-bodyparser");
import bootstrap = require("./bootstrap");
import dispatcher = require("./dispatcher");
import guid = require("guid");
import jwt = require("jsonwebtoken");
import koa = require("koa");
import koaRouter = require("koa-router");
import pat = require("./pat");
import sql = require("./sql");
import tokenValidator = require("./tokenvalidator");
import Q = require("q");

var mssql = require("mssql");

class TheBroomStack {
	private _publicKey: string;
	private _privateKey: string;
	private _koaApp: koa;
	private _router: koaRouter;

	private authenticate: (ctx: koa.Context, next: Function) => void;

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
		this.setupRoutes();
		await this.setupMiddleware();
	}

	private async setupMiddleware() {
		this.koa.use(bodyParser());
		this.koa.use(sql.connectSql(await bootstrap.getConnectionInfo()));

		this.koa.use((ctx, next) => {
			console.log(JSON.stringify(ctx, null, 4));
		});

		// Dispatcher
		//this.koa.use(dispatcher());

		this.koa.use((<any>this.router).routes());
	}

	private setupRoutes() {

		this.router.get("/login", async (ctx, next) => {
			const token = jwt.sign({user: "trevorsg"}, this._privateKey, { algorithm: "RS256", expiresIn: "24h", notBefore: "1h" });
			ctx.body = token;
		});

		this.router.get("/hello", this.authenticate, async (ctx, next) => {
			await next();
			ctx.body = "Waving hello.";
		});

		this.router.post("/person", async(ctx, next) => {
			if (ctx.request.body.displayname) {
				const request = new ctx.sqlConnection.Request();
				await request
					.input("displayname", ctx.request.body.displayname)
					.input("firstname", ctx.request.body.firstname)
					.input("lastname", ctx.request.body.lastname)
					.output("id")
					.execute("prc_AddPerson");

				console.log("Added person: " + request.parameters.id.value);
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
