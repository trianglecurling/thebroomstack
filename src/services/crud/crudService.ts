import { BaseQuery, Database, FilterQuery, JoinDatabaseQuery, Query } from "@deepkit/orm";
import { ClassSchema } from "@deepkit/type";

export interface OrderBy {
	field: string;
	direction?: "asc" | "desc";
}

export interface JoinHierarchy {
	[key: string]: JoinHierarchy;
}

export interface QueryOptions {
	orderBy?: OrderBy;
	project?: string[];
	limit?: number;
	skip?: number;
	filter?: FilterQuery<any>;
	join?: JoinHierarchy;
}

function _applyQueryJoins(hierarchy: JoinHierarchy, query: JoinDatabaseQuery<any, any>): JoinDatabaseQuery<any, any> {
	for (const [key, value] of Object.entries(hierarchy)) {
		let joinQuery = query.useJoinWith(key);
		joinQuery = _applyQueryJoins(value, joinQuery);
		query = joinQuery.end();
	}
	return query;
}

function applyQueryJoins<T extends Query<any>>(joins: JoinHierarchy, query: T): T {
	for (const [key, value] of Object.entries(joins)) {
		let joinQuery = query.useJoinWith(key);
		joinQuery = _applyQueryJoins(value, joinQuery);
		query = joinQuery.end();
	}
	return query;
}

function buildQuery<T extends BaseQuery<any>>(baseQuery: T, builderOptions: QueryOptions): T {
	const { orderBy, project, limit, skip, filter, join } = builderOptions;
	let query = baseQuery;
	const model = query.classSchema;

	if (orderBy) {
		const { field, direction = "asc" } = orderBy;
		if (!model.hasProperty(field)) {
			throw new Error(`400:Cannot sort by unknown field ${field}`);
		}
		if (field) {
			query = query.orderBy(field, direction);
		}
	}

	if (project) {
		for (const column of project) {
			if (!model.hasProperty(column)) {
				throw new Error(`400:Cannot project unknown field ${column}`);
			}
		}
		query = query.select(...project);
	}

	if (filter) {
		try {
			query = query.filter(filter);
		} catch (e) {
			throw new Error(`400:Error filtering query: ${e.message}.`);
		}
	}

	if (limit) {
		query = query.limit(limit);
	}

	if (skip) {
		query = query.skip(skip);
	}

	if (join) {
		query = applyQueryJoins(join, query as any);
	}

	return query;
}

export async function find(database: Database, model: ClassSchema<any>, options: QueryOptions) {
	const query = buildQuery(database.query(model), options);
	return query.find();
}

export async function count(
	database: Database,
	model: ClassSchema<any>,
	options: Omit<QueryOptions, "skip" | "limit" | "orderBy">
) {
	const query = buildQuery(database.query(model), options);
	return query.count();
}

export async function has(
	database: Database,
	model: ClassSchema<any>,
	options: Omit<QueryOptions, "skip" | "limit" | "orderBy">
) {
	const query = buildQuery(database.query(model), options);
	return query.has();
}
