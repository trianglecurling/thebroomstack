import koa = require("koa");
import bodyParser = require("koa-bodyparser");
import koaRouter = require("koa-router");
import guid = require("guid");

var mssql = require("mssql");

const app = new koa();
const router = new koaRouter();

router.get("/hello", async (ctx, next) => {
	await next();
	ctx.body = "Waving hello.";
});

router.post("/person", async(ctx, next) => {
	if (ctx.request.body.displayname) {
		const connection = await mssql.connect("mssql://thebroomstack:quadtakeout@localhost/thebroomstack");
		const request = new mssql.Request();
		await request
			.input("displayname", ctx.request.body.displayname)
			.input("firstname", ctx.request.body.firstname)
			.input("lastname", ctx.request.body.lastname)
			.output("id")
			.execute("prc_AddPerson")

		console.log("Added person: " + request.parameters.id.value);
		ctx.response.body = `Hello, ${request.parameters.id.value}!`;
	} else {
		throw new Error("A person requires a display name.");
	}
});

router.get("/write", async (ctx, next) => {
	await next();
	const connection = mssql.connect("mssql://thebroomstack:quadtakeout@localhost/thebroomstack").then(() => {
		new mssql.Request().query(`insert into [thebroomstack].[dbo].[tbl_teamtype] (id, name) values ('${guid.raw()}', 'Magic')`);
	}).catch((error: any) => {
		console.log(error);
	});
	ctx.body = "Inserted new row.";
});

app.use(bodyParser());

app.use((<any>router).routes());

app.use(async (ctx, next) => {
	try {
		await next(); // next is now a function
	} catch (err) {
		ctx.body = { message: err.message };
		ctx.status = err.status || 500;
	}
});

app.use(async (ctx, next) => {
	const before = new Date();
	await next();
	const after = new Date();
	ctx.body += " Response time = " + (after.getTime() - before.getTime());
});

app.use(async (ctx) => {
	ctx.body = "Hello, World!";
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			console.log("foo");
			resolve();
		}, 1000);
	});
});

app.listen(3000);
