declare namespace KWM {
	export const hotMiddleware: any;
	export const devMiddleware: any;
}

declare module "koa-webpack-middleware" {
	export = KWM;
}
