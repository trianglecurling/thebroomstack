import { FastifyPluginAsync } from "fastify";
import { Division } from "../../../dataModel/Division";
import { CrudComponent } from "../components/crudComponent";

export const DivisionsController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "division" });
};
