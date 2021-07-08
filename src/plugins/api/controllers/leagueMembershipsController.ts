import { FastifyPluginAsync } from "fastify";
import { LeagueMembership } from "../../../dataModel/joinerObjects/LeagueMembership";
import { CrudComponent } from "../components/crudComponent";

export const LeagueMembershipsController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "leagueMembership" });
};
