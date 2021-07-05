import { FastifyPluginAsync } from "fastify";
import { LeagueTeam } from "../../../dataModel/joinerObjects/LeagueTeam";
import { CrudComponent } from "../components/crudComponent";

export const LeagueTeamsController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "leagueTeam" });
};
