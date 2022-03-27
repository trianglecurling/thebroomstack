import { createModule } from "@deepkit/app";
import { FrontendService } from "../services/frontend/frontendService";
import { httpMiddleware } from "@deepkit/http";
import { serveStaticListener } from "@deepkit/http";
import { EntitiesService } from "../services/entities/entitiesService";
import path from "path";
import { CrudService } from "../services/crud/crudService";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpack from "webpack";
import { FrontendController } from "../controllers/FrontendController";
import { CrudController } from "../controllers/CrudController";

const webpackConfig = require("../client/webpack.config.js");
const { publicPath } = webpackConfig.output;
const compiler = webpack(webpackConfig);

export class FrontendModule extends createModule({
	controllers: [FrontendController, CrudController],
	providers: [{ provide: FrontendService, scope: "http" }, EntitiesService, CrudService],
	listeners: [],
	middlewares: [
		httpMiddleware.for(webpackDevMiddleware(compiler, { publicPath: publicPath.Path, writeToDisk: true })),
		httpMiddleware.for(webpackHotMiddleware(compiler)),
	],
}, 'frontend') {

	constructor() {
		super();

		const publicDir = path.resolve(__dirname, "..", "..", "public");
		this.addListener(serveStaticListener(this, '/public', publicDir));
	}
}
