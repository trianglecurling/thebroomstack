import { http, HttpResponse } from "@deepkit/http";
import { getClassSchema, plainToClass, t, ClassSchema } from "@deepkit/type";
import { getObjectKeysSize, ClassType } from "@deepkit/core";
import { AppModule } from "@deepkit/app";
import { TheBroomstackDatabase } from "../dataModel/database";

import { User } from "../dataModel/User";
import { Address } from "../dataModel/Address";
import { EmergencyContact } from "../dataModel/EmergencyContact";
import { ParentContact } from "../dataModel/ParentContact";
import { League } from "../dataModel/League";
import { LeagueFormat } from "../dataModel/LeagueFormat";
import { Draw } from "../dataModel/Draw";
import { DrawTime } from "../dataModel/DrawTime";
import { Division } from "../dataModel/Division";
import { Invoice } from "../dataModel/Invoice";
import { Match } from "../dataModel/Match";
import { Team } from "../dataModel/Team";
import { Sheet } from "../dataModel/Sheet";
import { Player } from "../dataModel/Player";
import { Club } from "../dataModel/Club";
import { Season } from "../dataModel/Season";

import { UserParentContact } from "../dataModel/joinerObjects/UserParentContact";
import { LeagueMembership } from "../dataModel/joinerObjects/LeagueMembership";
import { SpareCandidate } from "../dataModel/joinerObjects/SpareCandidate";
import { LeagueTeam } from "../dataModel/joinerObjects/LeagueTeam";
import { PlayerClub } from "../dataModel/joinerObjects/PlayerClub";

import { JoinHierarchy, OrderBy, CrudService, QueryOptions } from "../services/crud/crudService";

// https://gist.github.com/marcj/4ea2a6f45888b637a6ad72cc8ab41d84

function buildJoinHierarchy(joinPaths: string | string[] | undefined): JoinHierarchy | undefined {
	if (!joinPaths) {
		return undefined;
	}
	const parsedPaths = Array.isArray(joinPaths) ? joinPaths : joinPaths.split(",");
	const hierarchy: JoinHierarchy = {};
	for (const path of parsedPaths) {
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

function createController(schema: ClassSchema): ClassType {
	if (!schema.name) throw new Error(`Class ${schema.getClassName()} needs an entity name via @entity.name()`);

	class EntityQueryOptionsBase {
		@t.string.optional orderBy: string | undefined;
		@t.number.optional limit: number | undefined;
		@t.number.optional skip: number | undefined;
		@t.string.optional filter: string | undefined;
	}

	class EntityListQueryOptions extends EntityQueryOptionsBase {
		@t.string.optional project: string | undefined;
		@t.string.optional join: string | undefined;
		@(t.union(t.literal("find"), t.literal("count"), t.literal("has")).default("find")) method:
			| "find"
			| "count"
			| "has" = "find";
	}

	class EntityUpdateQueryOptions extends EntityQueryOptionsBase {
		@t.boolean.optional many: boolean | undefined;
	}

	function parseOrderBy(orderBy: string | undefined): OrderBy | undefined {
		if (!orderBy) {
			return undefined;
		}
		const [field, direction] = orderBy.split("-", 2);
		if (typeof direction === "string" && direction !== "asc" && direction !== "desc") {
			throw new HttpError(400, "The `orderBy` param must end with '-asc' or '-desc'.");
		}
		if (!schema.hasProperty(field)) {
			throw new HttpError(400, `The field "${field}" does not exist in the "${schema.name}" schema.`);
		}
		return { field, direction: direction };
	}

	const primaryKey = schema.getPrimaryField();

	@http.controller("/api/v1/" + schema.name)
	class RestController {
		constructor(protected database: TheBroomstackDatabase, protected crudService: CrudService) {}

		/**
		 * Gets an array of results
		 */
		@(http.GET("").description(`Gets a list of ${schema.name}.`))
		async list(@http.queries() options: EntityListQueryOptions) {
			if (options.method !== "find" && (options.skip !== undefined || options.limit !== undefined)) {
				throw new HttpError(400, "Cannot use skip or limit with count or has methods");
			}

			const queryOptions: QueryOptions = {
				orderBy: parseOrderBy(options.orderBy),
				project: options.project?.split(","),
				limit: options.limit,
				skip: options.skip,
				filter: typeof options.filter === "string" ? JSON.parse(options.filter) : undefined,
				join: buildJoinHierarchy(options.join),
			};
			if (options.method === "find") {
				return this.crudService.find(schema, queryOptions);
			} else if (options.method === "count") {
				return this.crudService.count(schema, queryOptions);
			} else if (options.method === "has") {
				return this.crudService.has(schema, queryOptions);
			} else {
				throw new HttpError(400, "Invalid method");
			}
		}

		/**
		 * Gets a single result by id.
		 */
		@(http.GET(":id").description(`Gets a single ${schema.name} by id.`))
		async get(@(http.query().optional) join: string | undefined, id: number) {
			const result = await this.crudService.findOne(schema, {
				filter: { [primaryKey.name]: id },
				join: buildJoinHierarchy(join),
			});
			if (!result) {
				throw new HttpError(404, `No ${schema.name} with id ${id} found.`);
			} else {
				return result;
			}
		}

		@(http.POST("").description("Adds a new " + schema.name))
		async post(@t.type(schema) @http.body() body: any) {
			return this.crudService.create(schema, body);
		}

		@(http.DELETE("").description(`Deletes ${schema.name} records.`))
		async delete(@http.queries() options: EntityUpdateQueryOptions) {
			const deleteOptions = {
				orderBy: parseOrderBy(options.orderBy),
				limit: options.limit,
				skip: options.skip,
				filter: typeof options.filter === "string" ? JSON.parse(options.filter) : undefined,
				many: options.many,
			};

			return this.crudService.delete(schema, deleteOptions);
		}

		@(http.DELETE(":id").description(`Deletes ${schema.name} records.`))
		async deleteOne(id: number) {
			const deleteOptions = {
				filter: { [primaryKey.name]: id },
				many: false,
			};

			return this.crudService.delete(schema, deleteOptions);
		}

		@(http.PUT("").description("Updates " + schema.name))
		async update(@t.partial(schema) @http.body() body: any, @http.queries() options: EntityUpdateQueryOptions) {
			const patchOptions = {
				orderBy: parseOrderBy(options.orderBy),
				limit: options.limit,
				skip: options.skip,
				filter: typeof options.filter === "string" ? JSON.parse(options.filter) : undefined,
				many: options.many,
			};

			return this.crudService.update(schema, patchOptions, body);
		}

        @(http.PUT(":id").description("Updates " + schema.name))
		async updateOne(id: number, @t.partial(schema) @http.body() body: any) {
			const patchOptions = {
				filter: { [primaryKey.name]: id },
				many: false,
			};

			return this.crudService.update(schema, patchOptions, body);
		}
	}

	Object.defineProperty(RestController, "name", { value: "RestController" + schema.getClassName() });

	return RestController;
}

const schemas = [
	User,
	Address,
	EmergencyContact,
	ParentContact,
	League,
	LeagueFormat,
	Draw,
	DrawTime,
	Division,
	Invoice,
	Match,
	Team,
	Sheet,
	Player,
	Club,
	Season,
	UserParentContact,
	LeagueMembership,
	SpareCandidate,
	LeagueTeam,
	PlayerClub,
];
const controllers = schemas.map(getClassSchema).map(createController);

export const CrudModule = new AppModule(
	{
		controllers: controllers,
		providers: [CrudService],
	},
	"crud"
);
