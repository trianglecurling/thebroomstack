import { FastifyPluginAsync } from "fastify";
import { Season } from "../../../dataModel/Season";
import { CrudComponent } from "../components/crudComponent";

export const SeasonsController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, {entityName: "season"});
};
