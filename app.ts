import koa = require("koa");

const app = new koa();

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