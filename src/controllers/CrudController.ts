import { FrontendService } from "../services/frontend/frontendService";
import { http } from "@deepkit/http";
import { EntitiesService } from "../services/entities/entitiesService";
import { singular } from "pluralize";
import { CrudService } from "../services/crud/crudService";
import { TheBroomstackDatabase } from "../dataModel/database";

@http.controller("/")
export class CrudController {
	constructor(
		protected frontendService: FrontendService,
		protected entitiesService: EntitiesService,
		protected crudService: CrudService,
		protected database: TheBroomstackDatabase
	) {}

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
	}
}