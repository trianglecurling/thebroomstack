import { entity, t } from "@deepkit/type";
import { User } from "./User";
import { IDataObject } from "../types/data";

@(entity.name("emergencyContact").collectionName("emergencyContacts"))
export class EmergencyContact implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t.backReference() public user?: User;

	constructor(
		@t public name: string,
		@t public phone: string,
		@t public relationship: string
	) {}
}
