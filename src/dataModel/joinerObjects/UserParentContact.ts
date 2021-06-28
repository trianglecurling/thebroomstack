import { entity, t } from "@deepkit/type";
import { User } from "../User";
import { ParentContact } from "../ParentContact";

@entity.name("userParentContact")
export class UserParentContact {
	@t.primary.autoIncrement public id: number = 0;

	constructor(
		@(t.type(() => User).reference()) public user: User,
		@(t.type(() => ParentContact).reference())
		public parentContact: ParentContact
	) {}
}
