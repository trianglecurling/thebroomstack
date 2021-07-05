import { FastifyPluginAsync } from "fastify";
import { LeagueFormat } from "../../../dataModel/LeagueFormat";
import { CrudComponent } from "../components/crudComponent";

export const LeagueFormatsController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "leagueFormat" });
};
