import { FastifyPluginAsync } from "fastify";
import { ParentContact } from "../../../dataModel/ParentContact";
import { CrudComponent } from "../components/crudComponent";

export const ParentContactsController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "parentContact" });
};
