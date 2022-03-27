import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
import { Player } from "../Player";
import { Club } from "../Club";

@entity.name("playerClub")
export class PlayerClub {
	public id: number & PrimaryKey & AutoIncrement = 0;

	constructor(
		public player: Player & Reference,
		public club: Club & Reference
	) {}
}
