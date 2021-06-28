import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";
import { Match } from "./Match";
import { Player } from "./Player";
import { LeagueTeam } from "./joinerObjects/LeagueTeam";

@(entity.name("team").collectionName("teams"))
export class Team implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public name?: string;

	@(t.array(() => League).backReference({ via: () => LeagueTeam }))
	leagues?: League[];

	@(t.array(() => Match).backReference()) public matches?: Match[];

	@(t.type(() => Player).reference()) public lead?: Player;
	@(t.type(() => Player).reference()) public second?: Player;
	@(t.type(() => Player).reference()) public vice?: Player;
	@(t.type(() => Player).reference()) public skip?: Player;
	@(t.type(() => Player).reference()) public alt1?: Player;
	@(t.type(() => Player).reference()) public alt2?: Player;
	@(t.type(() => Player).reference()) public coach?: Player;
	@(t.type(() => Player).reference()) public doubles1?: Player;
	@(t.type(() => Player).reference()) public doubles2?: Player;

	constructor() {}
}
