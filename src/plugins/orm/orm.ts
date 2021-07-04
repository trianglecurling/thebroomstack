import { FastifyPluginAsync } from "fastify";
import { initDB } from "../../dataModel/database";
import fp from "fastify-plugin";

export const OrmPlugin: FastifyPluginAsync = fp(async (fastify, opts) => {
    const database = await initDB(false);
	fastify.decorate("database", database);
});
