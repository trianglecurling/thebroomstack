import { FastifyPluginAsync } from "fastify";
import { UserParentContact } from "../../../dataModel/joinerObjects/UserParentContact";
import { CrudComponent } from "../components/crudComponent";

export const UserParentContactsController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "userParentContact" });
};
