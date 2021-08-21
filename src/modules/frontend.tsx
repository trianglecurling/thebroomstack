import { AppModule } from "@deepkit/app";
import { FrontendService } from "../services/frontend/frontendService";
import { http, httpMiddleware, HttpRequest } from "@deepkit/http";
import { serveStaticListener } from "@deepkit/http";
import { EntitiesService } from "../services/entities/entitiesService";
import { singular } from "pluralize";
import path from "path";
import { CrudService } from "../services/crud/crudService";
import { TheBroomstackDatabase } from "../dataModel/database";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpack from "webpack";

const webpackConfig = require("../client/webpack.config.js");
const { publicPath } = webpackConfig.output;
const compiler = webpack(webpackConfig);

@http.controller("/")
export class FrontendController {
	constructor(
		protected frontendService: FrontendService,
		protected request: HttpRequest,
		protected entitiesService: EntitiesService,
		protected crudService: CrudService,
		protected database: TheBroomstackDatabase
	) {}

	@(http.GET("").description("Home page"))
	async home() {
		return this.frontendService.renderAppTemplate({});
	}

	@(http.GET("crud").description("Crud index"))
	async crud() {
		return this.frontendService.renderAppTemplate({
			pageTitle: "The CRUD Stack",
			pageData: { entities: await this.entitiesService.getEntities() },
			scripts: ["main.js"],
			styleSheets: ["main.css"],
		});
	}

	@(http.GET("crud/:entityNamePlural").description("List entities"))
	async list(entityNamePlural: string) {
		const entityName = singular(entityNamePlural);
		return this.frontendService.renderAppTemplate({
			pageTitle: `CRUD for ${entityNamePlural}`,
			pageData: {
				entities: await this.entitiesService.getEntities(),
				entity: await this.entitiesService.getEntity(entityName),
                pluralizationMap: this.entitiesService.getPluralizationMap(),
				items: await this.crudService.find(this.database.getEntity(entityName), {}),
			},
			scripts: ["main.js"],
			styleSheets: ["main.css"],
		});
		// const result = this.entitiesService.getEntity(entityName);
	}

    // Route for hot module replacement event stream, handled by the webpackHotMiddleware below.
	@http.GET("/__webpack_hmr")
	async hmr() {}
}

const publicDir = path.resolve(__dirname, "..", "..", "public");
const servePublic = serveStaticListener("/public", publicDir);
export const FrontendModule = new AppModule(
	{
		controllers: [FrontendController],
		providers: [{ provide: FrontendService, scope: "http" }, EntitiesService, CrudService],
		listeners: [servePublic],
		middlewares: [
			httpMiddleware.for(webpackDevMiddleware(compiler, { publicPath: publicPath.Path, writeToDisk: true })),
			httpMiddleware.for(webpackHotMiddleware(compiler)),
		],
	},
	"frontend"
);
