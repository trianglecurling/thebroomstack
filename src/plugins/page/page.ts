import path from "path";
import { FastifyPluginAsync, FastifyReply } from "fastify";
import { CrudPlugin } from "./crud/crud";
import PointOfView from "point-of-view";
import Ejs from "ejs";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import fp from "fastify-plugin";

export const PagePlugin: FastifyPluginAsync = fp(async (fastify, opts) => {
	await fastify.register(PointOfView, {
		engine: {
			ejs: Ejs,
		},
	});
	fastify.decorateReply("pageData", undefined);
	fastify.addHook("onRequest", async (request, reply) => {
		reply.pageData = {
			scripts: ["/public/js/bundle.js"],
			moduleScripts: [],
			styleSheets: [],
			data: {},
			pageTitle: fastify.appName,
		};
	});
	fastify.decorateReply(
		"renderTemplate",
		async function (this: FastifyReply, relativeTemplatePath?: string) {
			const templatePath = path.join(
				"src",
				"plugins",
				"page",
				"client",
				"templates",
				relativeTemplatePath ?? "index.ejs"
			);

			return this.view(templatePath, this.pageData);
		}
	);
	fastify.register(CrudPlugin, { prefix: "/crud" });
});
