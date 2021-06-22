import { FastifyPluginAsync } from "fastify";
import { Association, ModelCtor } from "sequelize/types";

export const CrudPlugin: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("preHandler", async (request, reply) => {
		const allModels = Object.keys(fastify.sequelize.models);
		allModels.sort((a, b) => a.localeCompare(b));
		reply.pageData.data["models"] = allModels; // serializer.serialize(users[0]);
	});
	fastify.get("/", async (request, reply) => {
		const models = Object.keys(fastify.sequelize.models);
		Object.assign(reply.pageData?.data, { models });
		return reply.renderTemplate();
	});

	fastify.get<{ Params: { model: string } }>(
		"/:model",
		async (request, reply) => {
			const model = fastify.sequelize.model(request.params.model);
			if (model) {
				const items = await model.findAll();
				const associations = getAssociations(model);
                const modelName = model.name;
                const modelNamePlural = model.tableName;
				Object.assign(reply.pageData?.data, { modelName, modelNamePlural, items, associations });
				return reply.renderTemplate();
			}
		}
	);
};

type SerializableAssociation = Omit<
	Association,
	"source" | "target" | "inspect"
> & { through?: string };

function getAssociations(model: ModelCtor<any>) {
	const associations: SerializableAssociation[] = [];
	for (const assoc of Object.values(model.associations)) {
		const serializable: SerializableAssociation = {
			as: assoc.target.name,
			associationType: assoc.associationType,
			isSelfAssociation: assoc.isSelfAssociation,
			isSingleAssociation: assoc.isSingleAssociation,
			isMultiAssociation: assoc.isMultiAssociation,
			isAliased: assoc.isAliased,
			foreignKey: assoc.foreignKey,
			identifier: assoc.identifier,
		};

		const joinTableName: string | undefined = (assoc as any)["throughModel"]
			?.name;
		if (joinTableName) {
			serializable.through = joinTableName;
		}

		associations.push(serializable);
	}
	return associations;
}
