import { http, HttpResponse } from "@deepkit/http";
import { getClassSchema, t, ClassSchema } from "@deepkit/type";
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

// https://gist.github.com/marcj/4ea2a6f45888b637a6ad72cc8ab41d84

function createController(schema: ClassSchema): ClassType {
	if (!schema.name) throw new Error(`Class ${schema.getClassName()} needs an entity name via @entity.name()`);

	class EntityListOptions {
		@t.map(t.union("asc", "desc")) orderBy: { [name: string]: "asc" | "desc" } = {};
		@t.array(t.string) project: string[] = [];
		@t.optional limit: number = Infinity;
		@t.optional skip: number = 0;
		@t.partial(schema) filter?: Partial<any>;
		@t.map(t.string) join: { [name: string]: string } = {};
	}

	const primaryKey = schema.getPrimaryField();

	@http.controller("/api/v1/" + schema.name)
	class RestController {
		constructor(protected database: TheBroomstackDatabase) {}

		@http.GET("")
		async list(@http.queries() options: EntityListOptions, response: HttpResponse) {
			options.limit = Math.min(100, options.limit); //max 100
			let query = this.database.query(schema);

			for (const field of Object.keys(query.orderBy)) {
				if (!schema.hasProperty(field)) throw new Error(`Field ${field} does not exist`);
			}

			for (const [field, projection] of Object.entries(options.join)) {
				if (!schema.hasProperty(field)) throw new Error(`Join ${field} does not exist`);
				let join = query.useJoinWith(field);
				if (projection.length) {
					join = join.select(...projection.split(","));
				}
				query = join.end();
			}

			if (options.project) query = query.select(...options.project);

			if (getObjectKeysSize(query.orderBy) > 0) query.model.sort = query.orderBy;

			return query.filter(options.filter).limit(options.limit).skip(options.skip).find();
		}

		@(http.POST("").description("Adds a new " + schema.name))
		async post(@t.type(schema) @http.body() body: any) {
			//body is automatically validated
			await this.database.persist(body);
			return { [primaryKey.name]: body[primaryKey.name] };
		}

		@(http.DELETE(":id").description("Delete a " + schema.name))
		async remove(id: number) {
			const result = await this.database
				.query(schema)
				.filter({ [primaryKey.name]: id })
				.deleteOne();
			return { deleted: result.modified };
		}

		@(http.PUT(":id").description("Updates " + schema.name))
		async put(id: number, @t.type(schema) @http.body() body: any) {
			const item = await this.database
				.query(schema)
				.filter({ [primaryKey.name]: id })
				.findOne();
			delete body[primaryKey.name]; //we dont allow to change primary
			Object.assign(item, body);
			await this.database.persist(item);
			return true;
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

export const CrudModule = new AppModule({
	controllers: controllers,
});
