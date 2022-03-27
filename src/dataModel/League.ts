import { AutoIncrement, BackReference, entity, PrimaryKey, Reference } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { User } from "./User";
import { Team } from "./Team";
import { Draw } from "./Draw";
import { DrawTime } from "./DrawTime";
import { Division } from "./Division";
import { Season } from "./Season";
import { LeagueFormat } from "./LeagueFormat";
import { LeagueMembership } from "./joinerObjects/LeagueMembership";
import { LeagueTeam } from "./joinerObjects/LeagueTeam";

@(entity.name("league").collection("leagues"))
export class League implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public singleLeagueCost?: number;
	public additionalLeagueCost?: number;

	Users?: User[] & BackReference<{via: LeagueMembership}>;

	teams?: Team[] & BackReference<{via: LeagueTeam}>;

	public format?: LeagueFormat & Reference;

	public draws?: Draw[] & BackReference;

	public drawTimes?: DrawTime[] & BackReference;

	public divisions?: Division[] & BackReference;

	public season?: Season & Reference;

	constructor(public name: string, public dayOfWeek: number, public teamCapacity: number) {}
}
