import { FastifyPluginAsync } from "fastify";
import { Team } from "../../../dataModel/Team";
import { CrudComponent } from "../components/crudComponent";

export const TeamsController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "team" });
};
