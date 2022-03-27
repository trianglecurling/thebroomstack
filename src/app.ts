require("dotenv").config();
import { App } from "@deepkit/app";
import { FrameworkModule } from "@deepkit/framework";
import { AppConfig } from "./appConfig";
import { TheBroomstackDatabase } from "./dataModel/database";
import { CrudModule } from "./modules/CrudModule";
import { MetaModule } from "./modules/MetaModule";
import { FrontendModule } from "./modules/FrontendModule";
import path from "path";
import { http } from "@deepkit/http";
import * as Util from "./util";

Object.values(Util.httpStatusCodes);

@http.controller("/")
class AppController {
	@http.GET("heartbeat")
	index() {
		return new Date();
	}
}

new App({
	config: AppConfig,
	controllers: [AppController],
	imports: [
		new FrameworkModule({
			migrateOnStartup: true,
			debug: true,
		}),
		new CrudModule,
		new MetaModule,
		new FrontendModule(),
	],
	providers: [TheBroomstackDatabase],
})
	.loadConfigFromEnv({envFilePath: path.resolve(__dirname, "..", ".env")})
	.run();
