require("dotenv").config();
import "reflect-metadata";
import { Application, KernelModule } from "@deepkit/framework";
import { AppConfig } from "./appConfig";
import { TheBroomstackDatabase } from "./dataModel/database";
import { CrudModule } from "./modules/crud";
import path from "path";

Application.create({
	config: AppConfig,
	imports: [
		KernelModule.configure({
			databases: [TheBroomstackDatabase],
			migrateOnStartup: true,
			debug: true,
		}),
		CrudModule,
	],
})
	.loadConfigFromEnvFile(path.resolve(__dirname, "..", ".env"))
	.run();
