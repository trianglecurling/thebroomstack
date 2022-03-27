import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
import { User } from "../User";
import { League } from "../League";

@entity.name("leagueMembership")
export class LeagueMembership {
	public id: number & PrimaryKey & AutoIncrement = 0;
	created: Date = new Date();
	modified?: Date;

	public dateRemoved?: Date;
	public comments?: string;

	constructor(
		public dateJoined: Date,
		public user: User & Reference,
		public league: League & Reference
	) {}
}
