import { entity, t } from "@deepkit/type";
import { DrawTime } from "../DrawTime";
import { User } from "../User";

@entity.name("spareCandidate")
export class SpareCandidate {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	constructor(
		@(t.type(() => User).reference()) public user: User,
		@(t.type(() => DrawTime).reference()) public drawTime: DrawTime
	) {}
}
