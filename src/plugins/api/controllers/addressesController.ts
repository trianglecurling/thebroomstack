import { FastifyPluginAsync } from "fastify";
import { Address } from "../../../dataModel/Address";
import { CrudComponent } from "../components/crudComponent";

export const AddressesController: FastifyPluginAsync = async (
	fastify,
	opts
) => {
	fastify.register(CrudComponent, { entityName: "address" });
};
