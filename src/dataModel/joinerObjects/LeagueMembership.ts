import { entity, t } from "@deepkit/type";
import { User } from "../User";
import { League } from "../League";

@entity.name("leagueMembership")
export class LeagueMembership {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public dateRemoved?: Date;
	@t public comments?: string;

	constructor(
		@t public dateJoined: Date,
		@(t.type(() => User).reference()) public user: User,
		@(t.type(() => League).reference()) public league: League
	) {}
}
