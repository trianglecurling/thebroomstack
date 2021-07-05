import { FastifyPluginAsync } from "fastify";
import { Club } from "../../../dataModel/Club";
import { CrudComponent } from "../components/crudComponent";

export const ClubsController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "club" });
};
