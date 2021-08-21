import { FrontendService } from "../services/frontend/frontendService";
import { http } from "@deepkit/http";

@http.controller("/")
export class FrontendController {
	constructor(protected frontendService: FrontendService) {}

	@(http.GET("").description("Home page"))
	async home() {
		return this.frontendService.renderAppTemplate({});
	}

	// Route for hot module replacement event stream, handled by the webpackHotMiddleware below.
	@http.GET("/__webpack_hmr")
	async hmr() {}
}
