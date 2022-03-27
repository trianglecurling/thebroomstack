import { createModule } from "@deepkit/app";
import { EntitiesService } from "../services/entities/entitiesService";
import { http } from "@deepkit/http";

@http.controller("/meta/entities")
export class EntitiesController {
    constructor(protected entitiesService: EntitiesService) {}

    @http.GET("").description("Gets a list of all available entities")
    async list() {
        return this.entitiesService.getEntities();
    }

    @http.GET(":name").description("Gets an entity by name")
    async get(name: string) {
        return this.entitiesService.getEntity(name);
    }
}

export class MetaModule extends createModule({
	controllers: [EntitiesController],
	providers: [EntitiesService]
}, 'meta') {}
