import { FastifyPluginAsync } from "fastify";

export const CorePlugin: FastifyPluginAsync = async (fastify, opts) => {
    fastify.decorateReply("pageData", undefined);
    fastify.decorateReply("isApiRequest", false);
    fastify.addHook("onRequest", async (request, reply) => {
        request.isApiRequest = false;
    })
};