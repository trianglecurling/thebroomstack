// @ts-nocheck

import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { plainToClass } from "@deepkit/type";
import { Query, JoinDatabaseQuery, BaseQuery, DeleteResult, PatchResult } from "@deepkit/orm";
import { JoinHierarchy, find, OrderBy, findOne } from "../../../services/crud/crudService";
import { xxx } from "../../../util";

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

type SortDirection = "asc" | "desc";

export const CrudComponent: FastifyPluginAsync<CrudOptions> = fp(async (fastify, opts) => {
	const { entityName } = opts;
	const model = fastify.database.getEntity(entityName);

	fastify.get<{
		Querystring: QueryBuilderOptions & {
			method: "find" | "count" | "has";
		};
	}>("/", async (request, reply) => {
		const { method = "find" } = request.query;

		if (method !== "find" && (request.query.skip || request.query.limit)) {
			xxx(new Error("400:The `skip` and `limit` parameters are not valid for a " + method + " call."), reply);
		}

		let orderBy: OrderBy | undefined = undefined;
		if (request.query.orderBy) {
			const [field, direction] = request.query.orderBy.split("-", 2);
			if (typeof direction === "string" && direction !== "asc" && direction !== "desc") {
				xxx(new Error("400:The `orderBy` param must end with '-asc' or '-desc'."), reply);
			}
			orderBy = { field, direction: direction };
		}
		const limit = request.query.limit && Number(request.query.limit);
		if ((request.query.limit && !Number.isInteger(limit)) || limit === "") {
			xxx(new Error("400:Could not parse `" + request.query.limit + "` as an integer."), reply);
		}
		const skip = request.query.skip && Number(request.query.skip);
		if ((request.query.skip && !Number.isInteger(skip)) || skip === "") {
			xxx(new Error("400:Could not parse `" + request.query.skip + "` as an integer."), reply);
		}

		try {
			const results = await find(fastify.database, model, {
				orderBy,
				project: request.query.project?.split(","),
				limit,
				skip,
				filter: typeof request.query.filter === "string" ? JSON.parse(request.query.filter) : undefined,
				join:
					typeof request.query.join === "string"
						? buildJoinHierarchy(request.query.join.split(","))
						: undefined,
			});
			reply.send(results);
		} catch (e: unknown) {
			xxx(e, reply);
		}
	});

	fastify.get<{ Params: { id: string }; Querystring: { join?: string } }>("/:id", async (request, reply) => {
		try {
			const result = await findOne(fastify.database, model, {
				filter: { id: request.params.id },
				join:
					typeof request.query.join === "string"
						? buildJoinHierarchy(request.query.join.split(","))
						: undefined,
			});
			if (!result) {
				reply.status(404);
				throw new Error(`'${model.getName()}' with id '${request.params.id}' was not found.`);
			} else {
				reply.send(result);
			}
		} catch (e: unknown) {
			xxx(e, reply);
		}
	});

	fastify.post<{ Body: { [key: string]: unknown } }>("/", async (request, reply) => {
		const { body } = request;
		if (typeof body !== "object") {
			reply.status(400);
		}
		const plainRecord = { ...body };
		const record = plainToClass(model, plainRecord as any);

		if (reply.statusCode < 400) {
			const session = fastify.database.createSession();
			session.add(record);
			await session.commit();
			reply.send({ result: "success", entity: plainRecord });
		}
	});

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
		const [status, completeQuery] = buildQuery(patchQuery, request.query);
		if (status) {
			reply.status(status);
		}

		const { body } = request;
		if (typeof body !== "object") {
			reply.status(400);
		}

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
		const [status, completeQuery] = buildQuery(deleteQuery, request.query);
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

	fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
		const query = fastify.database.query(model).filter({ id: request.params.id });

		const result = await query.deleteOne();
		if (result.modified < 1) {
			reply.status(404);
		}
		reply.send(result);
	});
});

function buildQuery<T extends BaseQuery<any>>(
	baseQuery: T,
	builderOptions: QueryBuilderOptions
): [number | undefined, T] {
	const { orderBy, project, limit, skip, filter, join } = builderOptions;
	let query = baseQuery;
	const model = query.classSchema;
	let status: number | undefined = undefined;
	if (orderBy) {
		const [sortColumn, sortDirection = "asc"] = orderBy.split("-", 2) as [string, SortDirection];
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

function applyQueryJoins<T extends Query<any>>(joins: string, query: T): T {
	const hierarchy = buildJoinHierarchy(joins.split(","));
	for (const [key, value] of Object.entries(hierarchy)) {
		let joinQuery = query.useJoinWith(key);
		joinQuery = _applyQueryJoins(value, joinQuery);
		query = joinQuery.end();
	}
	return query;
}

function _applyQueryJoins(hierarchy: JoinHierarchy, query: JoinDatabaseQuery<any, any>): JoinDatabaseQuery<any, any> {
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
