import { AutoIncrement, BackReference, entity, PrimaryKey } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";

@(entity.name("season").collection("seasons"))
export class Season implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public leagues?: League[] & BackReference;

	constructor(public name: string, public startDate: Date, public endDate: Date) {}
}
