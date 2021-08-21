import { AppModuleConfig } from "@deepkit/app";
import { t } from "@deepkit/type";

export const AppConfig = new AppModuleConfig({
	dbPath: t.string.default("./database.sqlite"),
});
