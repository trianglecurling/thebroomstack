import type { Types } from "@deepkit/type";

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
