import { TheBroomstackDatabase } from "../../dataModel/database";
import { ReflectionClass } from "@deepkit/type";
import { plural } from "pluralize";

import { Entities, EntityData, PluralizationMap } from "../../types/shared";

function buildEntityForSchema(schema: ReflectionClass<any>): EntityData {
	const name = schema.getName();
	return {
		name,
		className: schema.getClassName(),
		properties: schema.getProperties().map((p) => ({
			name: p.name,
			type: p.type.kind,
			referenceType: p.isReference() ? p.getResolvedReflectionClass().getName() : undefined,
		})),
		associations: schema.getProperties().reduce<{ [key: string]: string }[]>((p, c) => {
			if (c.isReference()) {
				p.push({
					name: c.getResolvedReflectionClass().getName(),
				});
			}
			return p;
		}, []),
	};
}

export class EntitiesService {
	constructor(protected database: TheBroomstackDatabase) {
	}

	public async getEntities(): Promise<Entities> {
		return Array.from(this.database.entityRegistry.entities).map((e) => buildEntityForSchema(e));
	}

	public getPluralizationMap(): PluralizationMap {
		const singulars = Array.from(this.database.entityRegistry.entities).map((e) => e.getName());
		const toPlural = Object.fromEntries(singulars.map((s) => [s, plural(s)]));
		const toSingular = Object.fromEntries(singulars.map((s) => [toPlural[s], s]));
		return { toSingular, toPlural };
	}

	public async getEntity(name: string) {
		return buildEntityForSchema(this.database.getEntity(name));
	}
}
