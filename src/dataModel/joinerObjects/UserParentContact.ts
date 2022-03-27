import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
import { User } from "../User";
import { ParentContact } from "../ParentContact";

@entity.name("userParentContact")
export class UserParentContact {
	public id: number & PrimaryKey & AutoIncrement = 0;

	constructor(
		public user: User & Reference,
		public parentContact: ParentContact & Reference
	) {}
}
