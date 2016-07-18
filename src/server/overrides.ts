import * as qfs from "./qfs";
import * as koa from "koa";
import * as koaRouter from "koa-router";
import * as Constants from "./constants";
import * as path from "path";

module BroomstackOverrides {
	export function getBroomstackOverrides() {
		const router = new koaRouter();
		router.get("/favicon.ico", async (ctx, next) => {
			const image = await qfs.readFileBinary(path.join(Constants.ASSET_PATH, "img", "favicon.ico"));
			ctx.type = "image/x-icon";
			ctx.body = image;
		});
		return router;
	}
}
export = BroomstackOverrides;
