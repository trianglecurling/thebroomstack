import { FastifyPluginAsync } from "fastify";
import { Player } from "../../../dataModel/Player";
import { CrudComponent } from "../components/crudComponent";

export const PlayersController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "player" });
};
