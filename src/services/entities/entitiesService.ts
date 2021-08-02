import { TheBroomstackDatabase } from "../../dataModel/database";
import { injectable } from "@deepkit/injector";
import { ClassSchema } from "@deepkit/type";
import { Entities, EntityData, PluralizationMap } from "../../../@types/app/shared";
import { plural } from "pluralize";

function buildEntityForSchema(schema: ClassSchema<any>) {
	const name = schema.getName();
	return {
		name,
		className: schema.getClassName(),
		properties: schema.getProperties().map((p) => ({
			name: p.name,
			type: p.type,
			referenceType: p.isReference ? p.getResolvedClassSchema().getName() : undefined,
		})),
		associations: schema.getProperties().reduce<{ [key: string]: string }[]>((p, c) => {
			const resolvedSchema = c.type === "array" ? c.templateArgs?.[0] : c;
			if (resolvedSchema.isReference || resolvedSchema.type === "class") {
				p.push({
					name: resolvedSchema.getResolvedClassSchema().getName(),
				});
			}
			return p;
		}, []),
	};
}

@injectable()
export class EntitiesService {
	constructor(protected database: TheBroomstackDatabase) {}
	public async getEntities(): Promise<Entities> {
		return Array.from(this.database.entities).map((e) => buildEntityForSchema(e));
	}

	public getPluralizationMap(): PluralizationMap {
		const singulars = Array.from(this.database.entities).map((e) => e.getName());
		const toPlural = Object.fromEntries(singulars.map((s) => [s, plural(s)]));
		const toSingular = Object.fromEntries(singulars.map((s) => [toPlural[s], s]));
		return { toSingular, toPlural };
	}

	public async getEntity(name: string) {
		return buildEntityForSchema(this.database.getEntity(name));
	}
}
