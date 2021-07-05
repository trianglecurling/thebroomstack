import { FastifyPluginAsync } from "fastify";
import { Sheet } from "../../../dataModel/Sheet";
import { CrudComponent } from "../components/crudComponent";

export const SheetsController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "sheet" });
};
