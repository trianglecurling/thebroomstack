import { FastifyPluginAsync } from "fastify";

export const EntitiesController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.get("/", async (request, reply) => {
		const entities = Object.fromEntries(
			Array.from(fastify.database.entities).map((e) => [
				e.getName(),
				{
					name: e.getName(),
					className: e.getClassName(),
					properties: e.getProperties().map((p) => ({
						name: p.name,
						type: p.type,
						referenceType: p.isReference
							? p.getResolvedClassSchema().getName()
							: undefined,
					})),
				},
			])
		);
		reply.send(entities);
	});
};
