import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { plainToClass, ClassSchema } from "@deepkit/type";
import {
	Database,
	Query,
	JoinDatabaseQuery,
	BaseQuery,
	DeleteResult,
	PatchResult,
} from "@deepkit/orm";
import { ClassType } from "@deepkit/core";

interface CrudOptions {
	entityName: string;
}

interface QueryBuilderOptions {
	orderBy?: `${string}-${SortDirection}`;
	project?: string;
	limit?: string;
	skip?: string;
	filter?: string;
	join?: string;
}

function buildQuery<T extends BaseQuery<any>>(
	baseQuery: T,
	builderOptions: QueryBuilderOptions
): [number | undefined, T] {
	const { orderBy, project, limit, skip, filter, join } = builderOptions;
	let query = baseQuery;
	const model = query.classSchema;
	let status: number | undefined = undefined;
	if (orderBy) {
		const [sortColumn, sortDirection = "asc"] = orderBy.split("-", 2) as [
			string,
			SortDirection
		];
		if (!model.hasProperty(sortColumn)) {
			status = 400;
		}
		if (sortColumn) {
			query = query.orderBy(sortColumn, sortDirection);
		}
	}
	if (project) {
		const columns = project.split(",");
		for (const column of columns) {
			if (!model.hasProperty(column)) {
				status = 400;
			}
		}
		query = query.select(...columns);
	}
	if (filter) {
		try {
			const filterObj = JSON.parse(filter);
			query = query.filter(filterObj);
		} catch {
			status = 400;
		}
	}
	if (limit) {
		const limitInt = Number(limit);
		if (!Number.isInteger(limitInt)) {
			status = 400;
		} else {
			query = query.limit(limitInt);
		}
	}
	if (skip) {
		const skipInt = Number(skip);
		if (!Number.isInteger(skipInt)) {
			status = 400;
		} else {
			query = query.skip(skipInt);
		}
	}
	if (join) {
		query = applyQueryJoins(join, query as any);
	}
	return [status, query];
}

type SortDirection = "asc" | "desc";

export const CrudComponent: FastifyPluginAsync<CrudOptions> = fp(
	async (fastify, opts) => {
		const { entityName } = opts;
		const model = fastify.database.getEntity(entityName);

		fastify.get<{
			Querystring: QueryBuilderOptions & {
				method: "find" | "count" | "has";
			};
		}>("/", async (request, reply) => {
			let query = fastify.database.query(model);

			const { method = "find" } = request.query;

			if (
				method !== "find" &&
				(request.query.skip || request.query.limit)
			) {
				reply.status(400);
			}

			const [status, completeQuery] = buildQuery(query, request.query);
			if (status) {
				reply.status(status);
			}

			const records = await completeQuery[method]();
			reply.send(records);
		});

		fastify.get<{ Params: { id: string }; Querystring: { join?: string } }>(
			"/:id",
			async (request, reply) => {
				let query = fastify.database
					.query(model)
					.filter({ id: request.params.id });

				if (request.query.join) {
					query = applyQueryJoins(request.query.join, query);
				}

				const record = await query.findOneOrUndefined();
				if (!record) {
					reply.status(404);
					reply.send("Not found");
				} else {
					reply.send(record);
				}
			}
		);

		fastify.post<{ Body: { [key: string]: unknown } }>(
			"/",
			async (request, reply) => {
				const { body } = request;
				if (typeof body !== "object") {
					reply.status(400);
				}
				const plainRecord = { ...body };
				const references = extractReferences(model, plainRecord);
				const record = plainToClass(model, plainRecord as any);
				populateReferences(record, references, fastify.database);

				if (reply.statusCode < 400) {
					const session = fastify.database.createSession();
					session.add(record);
					await session.commit();
					reply.send({ result: "success", entity: plainRecord });
				}
			}
		);

		fastify.patch<{
			Querystring: QueryBuilderOptions & {
				many?: "true";
			};
			Body: { [key: string]: unknown };
		}>("/", async (request, reply) => {
			if (request.query.join || request.query.project) {
				reply.status(400);
			}
			const patchQuery = fastify.database.query(model);
			const [status, completeQuery] = buildQuery(
				patchQuery,
				request.query
			);
			if (status) {
				reply.status(status);
			}

			const { body } = request;
			if (typeof body !== "object") {
				reply.status(400);
			}
			const plainRecord = { ...body };
			const references = extractReferences(model, plainRecord);
			const record = plainToClass(model, plainRecord as any);
			populateReferences(record, references, fastify.database);

			if (reply.statusCode < 400) {
				let result: PatchResult<any>;
				if (request.query.many === "true") {
					result = await completeQuery.patchMany(body);
				} else {
					result = await completeQuery.patchOne(body);
				}
				if (result.modified < 1) {
					reply.status(404);
				}
				reply.send(result);
			}
		});

		fastify.delete<{
			Querystring: QueryBuilderOptions & {
				many?: "true";
			};
		}>("/", async (request, reply) => {
			if (request.query.join || request.query.project) {
				reply.status(400);
			}
			const deleteQuery = fastify.database.query(model);
			const [status, completeQuery] = buildQuery(
				deleteQuery,
				request.query
			);
			if (status) {
				reply.status(status);
			}

			if (reply.statusCode < 400) {
				let result: DeleteResult<any>;
				if (request.query.many === "true") {
					result = await completeQuery.deleteMany();
				} else {
					result = await completeQuery.deleteOne();
				}
				if (result.modified < 1) {
					reply.status(404);
				}
				reply.send(result);
			}
		});
	}
);

interface JoinHierarchy {
	[key: string]: JoinHierarchy;
}

function applyQueryJoins<T extends Query<any>>(joins: string, query: T): T {
	const hierarchy = buildJoinHierarchy(joins.split(","));
	for (const [key, value] of Object.entries(hierarchy)) {
		let joinQuery = query.useJoinWith(key);
		joinQuery = _applyQueryJoins(value, joinQuery);
		query = joinQuery.end();
	}
	return query;
}

function _applyQueryJoins(
	hierarchy: JoinHierarchy,
	query: JoinDatabaseQuery<any, any>
): JoinDatabaseQuery<any, any> {
	for (const [key, value] of Object.entries(hierarchy)) {
		let joinQuery = query.useJoinWith(key);
		joinQuery = _applyQueryJoins(value, joinQuery);
		query = joinQuery.end();
	}
	return query;
}

function buildJoinHierarchy(joinPaths: string[]): JoinHierarchy {
	const hierarchy: JoinHierarchy = {};
	for (const path of joinPaths) {
		const segments = path.split(".");
		let currentHierarchy: JoinHierarchy = hierarchy;
		for (let i = 0; i < segments.length; ++i) {
			const segment = segments[i];
			if (!(segment in currentHierarchy)) {
				const newHierarchy: JoinHierarchy = {};
				currentHierarchy[segment] = newHierarchy;
				currentHierarchy = newHierarchy;
			} else {
				currentHierarchy = currentHierarchy[segment];
			}
		}
	}
	return hierarchy;
}

interface ExtractedReferences {
	[key: string]: [fkValue: number, type: ClassType] | ExtractedReferences;
}

function extractReferences(
	schema: ClassSchema<any>,
	plainRecord: { [x: string]: unknown }
) {
	const references: ExtractedReferences = {};
	for (const [key, value] of Object.entries(plainRecord)) {
		if (!schema.hasProperty(key)) {
			throw new Error("Unexpected key");
		}
		const property = schema.getProperty(key);
		if (property.isReference && property.resolveClassType) {
			if (typeof value === "number") {
				references[key] = [value, property.getResolvedClassType()];
				delete plainRecord[key];
			} else if (typeof value === "object" && value !== null) {
				const schema = property.getResolvedClassSchema();
				const subReferences = extractReferences(
					schema,
					value as { [x: string]: unknown }
				);
				references[key] = subReferences;
			}
		}
	}
	return references;
}

function populateReferences(
	instance: any,
	references: ExtractedReferences,
	database: Database
): void {
	for (const [key, refData] of Object.entries(references)) {
		if (Array.isArray(refData)) {
			instance[key] = database.getReference(refData[1], refData[0]);
		} else {
			populateReferences(instance[key], refData, database);
		}
	}
}
