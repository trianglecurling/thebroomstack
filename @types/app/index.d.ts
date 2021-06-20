interface PageData {
	pageTitle: string;
	moduleScripts: string[];
	scripts: string[];
	styleSheets: string[];
	data: any;
}

declare module "app-core" {
	declare module "fastify" {
		interface FastifyInstance {
			appName: string;
		}
		interface FastifyRequest {
			isApiRequest: boolean;
		}
		interface FastifyReply {
			pageData?: PageData;
			renderTemplate: (
				relativeTemplatePath?: string
			) => Promise<FastifyReply>;
		}
	}
}
