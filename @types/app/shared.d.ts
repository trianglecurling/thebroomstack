import type { Types } from "@deepkit/type";

interface IPageContext {
	moduleScripts: string[];
	pageTitle: string;
	pageData: any;
	scripts: string[];
	styleSheets: string[];
}

interface EntityData {
	name: string;
	className: string;
	associations: { [key: string]: string }[];
	properties: {
		name: string;
		type: Types;
		referenceType: string | undefined;
	}[];
}

type PluralizationMap = Record<"toSingular" | "toPlural", { [key: string]: string }>;

type Entities = EntityData[];
