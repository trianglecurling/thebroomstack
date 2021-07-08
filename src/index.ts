require("dotenv").config();
import "reflect-metadata";
import fs from "fs/promises";
import Fastify from "fastify";
// import sequelizeFastify from "sequelize-fastify";
import staticPlugin from "fastify-static";
//import schema from "./schema";
import { CorePlugin } from "./plugins/core/core";
import { ApiPlugin } from "./plugins/api/api";
import { PagePlugin } from "./plugins/page/page";
import path from "path/posix";
import FastifyExpress from "fastify-express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { OrmPlugin } from "./plugins/orm/orm";

const webpackConfig = require("./plugins/page/client/webpack.config.js");

const compiler = webpack(webpackConfig);
const { publicPath } = webpackConfig.output;

const fastify = Fastify({
	logger: true,
});

fastify.decorate("appName", process.env.APP_NAME);
fastify.register(FastifyExpress);
fastify.register(staticPlugin, {
	root: path.resolve(__dirname, "..", "public"),
	prefix: "/public",
});
fastify.register(OrmPlugin);
// fastify.register(sequelizeFastify, {
// 	sequelizeOptions: { dialect: "sqlite", storage: "./data/db.sqlite" },
// });
//fastify.register(schema, { logLevel: "trace" });
fastify.register(CorePlugin);
fastify.register(ApiPlugin, { prefix: "/api/v1" });
fastify.register(PagePlugin);

fastify.get("/favicon.png", (request, reply) => {
	reply.sendFile("favicon.png");
});

fastify.ready(async () => {
	try {
		// first connection as test
		// await fastify.sequelize.authenticate();
		// console.log("Connection has been established successfully.");

		fastify.use(
			webpackDevMiddleware(compiler, {
				publicPath: publicPath.path,
				writeToDisk: true,
			})
		);
		fastify.use(webpackHotMiddleware(compiler));
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
});

const start = async () => {
	// Misc boot operations
	const faviconConfigPath = path.join(__dirname, "..", ".config", process.env.FAVICON_CONFIG_PATH ?? "favicon.png");
	await fs.copyFile(faviconConfigPath, path.join(__dirname, "..", "public", "favicon.png"));

	try {
		await fastify.listen(8000);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
