import { entity, t } from "@deepkit/type";
import { User } from "./User";
import { IDataObject } from "../types/data";
import { UserParentContact } from "./joinerObjects/UserParentContact";

@(entity.name("parentContact").collectionName("parentContacts"))
export class ParentContact implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@(t.array(() => User).backReference({ via: () => UserParentContact }))
	users?: User[];

	constructor(@t public name: string, @t public phone: string, @t public email: string) {}
}
