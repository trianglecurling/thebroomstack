import { FastifyPluginAsync } from "fastify";
import { getEntities } from "../../../services/entities/entitiesService";

export const EntitiesController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.get("/", async (request, reply) => {
		const entities = getEntities(fastify.database);
		reply.send(entities);
	});
};
