import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
import { League } from "../League";
import { Team } from "../Team";

@entity.name("leagueTeam")
export class LeagueTeam {
	public id: number & PrimaryKey & AutoIncrement = 0;

	constructor(
		public league: League & Reference,
		public team: Team & Reference
	) {}
}
