import { FastifyPluginAsync } from "fastify";
import { PlayerClub } from "../../../dataModel/joinerObjects/PlayerClub";
import { CrudComponent } from "../components/crudComponent";

export const PlayerClubsController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "playerClub" });
};
