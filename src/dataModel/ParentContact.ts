import { AutoIncrement, BackReference, entity, PrimaryKey } from "@deepkit/type";
import { User } from "./User";
import { IDataObject } from "../types/data";
import { UserParentContact } from "./joinerObjects/UserParentContact";

@(entity.name("parentContact").collection("parentContacts"))
export class ParentContact implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	users?: User[] & BackReference<{via: UserParentContact}>;

	constructor(public name: string, public phone: string, public email: string) {}
}
