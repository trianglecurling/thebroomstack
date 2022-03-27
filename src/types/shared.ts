import type { ReflectionKind } from "@deepkit/type";

export interface IPageContext {
	moduleScripts: string[];
	pageTitle: string;
	pageData: any;
	scripts: string[];
	styleSheets: string[];
}

export interface EntityData {
	name: string;
	className: string;
	associations: { [key: string]: string }[];
	properties: {
		name: string;
		type: ReflectionKind;
		referenceType: string | undefined;
	}[];
}

export type PluralizationMap = Record<"toSingular" | "toPlural", { [key: string]: string }>;

export type Entities = EntityData[];
