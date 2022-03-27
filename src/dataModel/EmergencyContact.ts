import { AutoIncrement, BackReference, entity, PrimaryKey } from "@deepkit/type";
import { User } from "./User";
import { IDataObject } from "../types/data";

@(entity.name("emergencyContact").collection("emergencyContacts"))
export class EmergencyContact implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public user?: User & BackReference;

	constructor(public name: string, public phone: string, public relationship: string) {}
}
