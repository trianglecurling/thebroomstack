import { FastifyPluginAsync } from "fastify";
import { Invoice } from "../../../dataModel/Invoice";
import { CrudComponent } from "../components/crudComponent";

export const InvoicesController: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "invoice" });
};
