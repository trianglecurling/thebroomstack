import { BaseQuery, DeleteResult, FilterQuery, JoinDatabaseQuery, PatchResult, Query } from "@deepkit/orm";
import { ClassSchema, plainToClass } from "@deepkit/type";
import { TheBroomstackDatabase } from "../../dataModel/database";
import { injectable } from "@deepkit/injector";

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
	many?: boolean;
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
			throw new HttpError(400, `Cannot sort by unknown field ${field}`);
		}
		if (field) {
			query = query.orderBy(field, direction);
		}
	}

	if (project) {
		for (const column of project) {
			if (!model.hasProperty(column)) {
				throw new HttpError(400, `Cannot project unknown field ${column}`);
			}
		}
		query = query.select(...project);
	}

	if (filter) {
		try {
			query = query.filter(filter);
		} catch (e) {
			throw new HttpError(400, `Error filtering query: ${e.message}.`);
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

@injectable()
export class CrudService {
	constructor(protected database: TheBroomstackDatabase) {}
	public async findOne(model: ClassSchema<any>, options: Omit<QueryOptions, "limit" | "many">) {
		const query = buildQuery(this.database.query(model), options);
		return query.findOneOrUndefined();
	}

	public async find(model: ClassSchema<any>, options: QueryOptions) {
		const query = buildQuery(this.database.query(model), options);
		return query.find();
	}

	public async count(model: ClassSchema<any>, options: Omit<QueryOptions, "skip" | "limit" | "orderBy" | "many">) {
		const query = buildQuery(this.database.query(model), options);
		return query.count();
	}

	public async has(model: ClassSchema<any>, options: Omit<QueryOptions, "skip" | "limit" | "orderBy" | "many">) {
		const query = buildQuery(this.database.query(model), options);
		return query.has();
	}

	public async create(model: ClassSchema<any>, body: any) {
		// body should already be validated at this point
		const plainRecord = { ...body };
		delete plainRecord[model.getPrimaryFieldName()];
		delete plainRecord["created"];
		delete plainRecord["modified"];
		const record = plainToClass(model, plainRecord);
		await this.database.persist(record);
		return record;
	}

	public async delete(model: ClassSchema<any>, options: Omit<QueryOptions, "project" | "join">) {
		const query = buildQuery(this.database.query(model), options);
		let result: DeleteResult<any>;
		if (options.many) {
			result = await query.deleteMany();
		} else {
			result = await query.deleteOne();
		}
		if (result.modified < 1) {
			throw new HttpError(404, `No record found for deletion`);
		}
		return result;
	}

	public async update(model: ClassSchema<any>, options: Omit<QueryOptions, "project" | "join">, body: any) {
		const plainRecord = { ...body };
        delete plainRecord[model.getPrimaryFieldName()];
		plainRecord["modified"] = new Date();
		const query = buildQuery(this.database.query(model), options);
		let result: PatchResult<any>;
		if (options.many) {
			result = await query.patchMany(plainRecord);
		} else {
			result = await query.patchOne(plainRecord);
		}
		if (result.modified < 1) {
			throw new HttpError(404, `No record found for deletion`);
		}
		return result;
	}
}
