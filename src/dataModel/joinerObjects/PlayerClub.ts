import { entity, t } from "@deepkit/type";
import { Player } from "../Player";
import { Club } from "../Club";

@entity.name("playerClub")
export class PlayerClub {
	@t.primary.autoIncrement public id: number = 0;

	constructor(
		@(t.type(() => Player).reference()) public player: Player,
		@(t.type(() => Club).reference()) public club: Club
	) {}
}
