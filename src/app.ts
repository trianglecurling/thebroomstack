import koa = require("koa");
import koaRouter = require("koa-router");

const app = new koa();
const router = new koaRouter();

router.get("/hello", async (ctx, next) => {
    await next();
    ctx.body = "Waving hello.";

});

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
