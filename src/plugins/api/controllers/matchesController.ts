import { FastifyPluginAsync } from "fastify";
import { Match } from "../../../dataModel/Match";
import { CrudComponent } from "../components/crudComponent";

export const MatchesController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "match" });
};
