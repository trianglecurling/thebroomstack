import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";

@(entity.name("leagueFormat").collectionName("leagueFormats"))
export class LeagueFormat implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	constructor(@t public format: string, @t public playersPerTeam: number) {}
}
