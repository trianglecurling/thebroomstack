import { AppModule } from "@deepkit/app";
import { FrontendService } from "../services/frontend/frontendService";
import { http } from "@deepkit/http";

@http.controller("/")
export class FrontendController {
	constructor(protected frontendServie: FrontendService) {}

	@(http.GET("").description("Home page"))
	async home() {
		return this.frontendServie.renderAppTemplate({});
	}
}

export const FrontendModule = new AppModule(
	{
		controllers: [FrontendController],
		providers: [FrontendService],
	},
	"frontend"
);
