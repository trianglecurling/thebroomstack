import { FastifyPluginAsync } from "fastify";
import { EmergencyContact } from "../../../dataModel/EmergencyContact";
import { CrudComponent } from "../components/crudComponent";

export const EmergencyContactsController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "emergencyContact" });
};
