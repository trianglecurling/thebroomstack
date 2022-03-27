import { AutoIncrement, BackReference, entity, PrimaryKey, Reference } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";
import { Match } from "./Match";
import { Player } from "./Player";
import { LeagueTeam } from "./joinerObjects/LeagueTeam";

@(entity.name("team").collection("teams"))
export class Team implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public name?: string;

	leagues?: League[] & BackReference<{ via: LeagueTeam }>;

	public matches?: Match[] & BackReference;

	public lead?: Player & Reference;
	public second?: Player & Reference;
	public vice?: Player & Reference;
	public skip?: Player & Reference;
	public alt1?: Player & Reference;
	public alt2?: Player & Reference;
	public coach?: Player & Reference;
	public doubles1?: Player & Reference;
	public doubles2?: Player & Reference;

	constructor() {}
}
