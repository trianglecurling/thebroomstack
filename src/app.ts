require("dotenv").config();
import "reflect-metadata";
import { Application, KernelModule } from "@deepkit/framework";
import { AppConfig } from "./appConfig";
import { TheBroomstackDatabase } from "./dataModel/database";
import { CrudModule } from "./modules/crud";
import { MetaModule } from "./modules/meta";
import { FrontendModule } from "./modules/frontend";
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

Application.create({
	config: AppConfig,
	controllers: [AppController],
	imports: [
		KernelModule.configure({
			migrateOnStartup: true,
			debug: true,
		}),
		CrudModule,
		MetaModule,
		FrontendModule.forRoot(),
	],
	providers: [TheBroomstackDatabase],
})
	.loadConfigFromEnvFile(path.resolve(__dirname, "..", ".env"))
	.run();
