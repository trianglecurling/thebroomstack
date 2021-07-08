import { Database } from "@deepkit/orm";

export function getEntities(database: Database) {
	const entities = Object.fromEntries(
		Array.from(database.entities).map((e) => [
			e.getName(),
			{
				name: e.getName(),
				className: e.getClassName(),
				properties: e.getProperties().map((p) => ({
					name: p.name,
					type: p.type,
					referenceType: p.isReference ? p.getResolvedClassSchema().getName() : undefined,
				})),
			},
		])
	);
	return entities;
}
