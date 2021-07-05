import { FastifyPluginAsync } from "fastify";
import { User } from "../../../dataModel/User";
import { CrudComponent } from "../components/crudComponent";

export const UsersController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "user" });
};
