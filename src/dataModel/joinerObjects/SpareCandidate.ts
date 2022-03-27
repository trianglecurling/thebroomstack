import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
import { DrawTime } from "../DrawTime";
import { User } from "../User";

@entity.name("spareCandidate")
export class SpareCandidate {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	constructor(
		public user: User & Reference,
		public drawTime: DrawTime & Reference
	) {}
}
