import { entity, t } from "@deepkit/type";
import { League } from "../League";
import { Team } from "../Team";

@entity.name("leagueTeam")
export class LeagueTeam {
	@t.primary.autoIncrement public id: number = 0;

	constructor(
		@(t.type(() => League).reference()) public league: League,
		@(t.type(() => Team).reference()) public team: Team
	) {}
}
