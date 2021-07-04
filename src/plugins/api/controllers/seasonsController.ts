import { FastifyPluginAsync } from "fastify";
import { Season } from "../../../dataModel/Season";
import { autoSerialize } from "../../../util";
import { plainToClass } from "@deepkit/type";

export const SeasonsController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.get("/", async (request, reply) => {
		const seasons = await fastify.database.query(Season).find();
		reply.send(autoSerialize(seasons));
	});

	fastify.post("/", async (request, reply) => {
		const season = plainToClass(Season, request.body as any);
		await fastify.database.persist(season);
		reply.send({ result: "success", entity: autoSerialize(season) });
	});
};
