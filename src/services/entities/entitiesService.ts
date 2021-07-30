import { TheBroomstackDatabase } from "../../dataModel/database";
import { injectable } from "@deepkit/injector";
import { ClassSchema } from "@deepkit/type";

function buildEntityForSchema(schema: ClassSchema<any>) {
	return {
		name: schema.getName(),
		className: schema.getClassName(),
		properties: schema.getProperties().map((p) => ({
			name: p.name,
			type: p.type,
			referenceType: p.isReference ? p.getResolvedClassSchema().getName() : undefined,
		})),
	};
}

@injectable()
export class EntitiesService {
	constructor(protected database: TheBroomstackDatabase) {}
	public async getEntities() {
		const entities = Object.fromEntries(
			Array.from(this.database.entities).map((e) => [e.getName(), buildEntityForSchema(e)])
		);
		return entities;
	}

	public async getEntity(name: string) {
		return buildEntityForSchema(this.database.getEntity(name));
	}
}
