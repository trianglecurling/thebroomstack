require("dotenv").config();
import "reflect-metadata";
import { Application, KernelModule } from "@deepkit/framework";
import { AppConfig } from "./appConfig";
import { TheBroomstackDatabase } from "./dataModel/database";
import { CrudModule } from "./modules/crud";
import { MetaModule } from "./modules/meta";
import path from "path";
import * as Util from "./util";

Object.values(Util.httpStatusCodes);

Application.create({
	config: AppConfig,
	imports: [
		KernelModule.configure({
			databases: [TheBroomstackDatabase],
			migrateOnStartup: true,
			debug: true,
		}),
		CrudModule,
		MetaModule,
	],
})
	.loadConfigFromEnvFile(path.resolve(__dirname, "..", ".env"))
	.run();
