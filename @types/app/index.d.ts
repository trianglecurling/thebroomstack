interface PageData {
	pageTitle: string;
	moduleScripts: string[];
	scripts: string[];
	styleSheets: string[];
	data: any;
}

declare module "app-core" {
	import { Database } from "@deepkit/orm";
	import { SQLiteDatabaseAdapter } from "@deepkit/sqlite";
	declare module "fastify" {
		interface FastifyInstance {
			appName: string;
			database: Database<SQLiteDatabaseAdapter>;
		}
		interface FastifyRequest {
			isApiRequest: boolean;
		}
		interface FastifyReply {
			pageData: PageData;
			renderTemplate: (
				relativeTemplatePath?: string
			) => Promise<FastifyReply>;
		}
	}
}
