import { FastifyPluginAsync } from "fastify";
import { League } from "../../../dataModel/League";
import { CrudComponent } from "../components/crudComponent";

export const LeaguesController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, {entityName: "league"});
};
