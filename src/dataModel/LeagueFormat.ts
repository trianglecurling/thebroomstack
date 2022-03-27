import { AutoIncrement, entity, PrimaryKey } from "@deepkit/type";
import { IDataObject } from "../types/data";

@(entity.name("leagueFormat").collection("leagueFormats"))
export class LeagueFormat implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	constructor(public format: string, public playersPerTeam: number) {}
}
