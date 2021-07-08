import { entity, t } from "@deepkit/type";
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

@(entity.name("league").collectionName("leagues"))
export class League implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public singleLeagueCost?: number;
	@t public additionalLeagueCost?: number;

	@(t.array(() => User).backReference({ via: () => LeagueMembership }))
	Users?: User[];

	@(t.array(() => Team).backReference({ via: () => LeagueTeam }))
	teams?: Team[];

	@(t.type(() => LeagueFormat).reference()) public format?: LeagueFormat;

	@(t.array(() => Draw).backReference()) public draws?: Draw[];

	@(t.array(() => DrawTime).backReference()) public drawTimes?: DrawTime[];

	@(t.array(() => Division).backReference()) public divisions?: Division[];

	@(t.type(() => Season).reference()) public season?: Season;

	constructor(@t public name: string, @t public dayOfWeek: number, @t public teamCapacity: number) {}
}
