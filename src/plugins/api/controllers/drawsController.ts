import { FastifyPluginAsync } from "fastify";
import { Draw } from "../../../dataModel/Draw";
import { CrudComponent } from "../components/crudComponent";

export const DrawsController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "draw" });
};
