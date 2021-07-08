import { FastifyPluginAsync } from "fastify";
import { DrawTime } from "../../../dataModel/DrawTime";
import { CrudComponent } from "../components/crudComponent";

export const DrawTimesController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "drawTime" });
};
