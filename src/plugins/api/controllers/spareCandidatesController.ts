import { FastifyPluginAsync } from "fastify";
import { SpareCandidate } from "../../../dataModel/joinerObjects/SpareCandidate";
import { CrudComponent } from "../components/crudComponent";

export const SpareCandidatesController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "spareCandidate" });
};
