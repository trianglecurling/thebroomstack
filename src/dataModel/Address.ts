import { AutoIncrement, entity, PrimaryKey } from "@deepkit/type";
import { IDataObject } from "../types/data";

@(entity.name("address").collection("addresses"))
export class Address implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public line2?: string;

	constructor(public line1: string, public city: string, public state: string, public zip: string) {}
}
