import { AutoIncrement, BackReference, entity, PrimaryKey, Reference } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";
import { Match } from "./Match";

@(entity.name("draw").collection("draws"))
export class Draw implements IDataObject {
	public id: number& PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public league?: League & Reference;

	public matches?: Match[] & BackReference;

	// public event?: Event & Reference;

	constructor(public date: Date) {}
}
