import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";

@(entity.name("division").collection("divisions"))
export class Division implements IDataObject {
	public id: number& PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public league?: League & Reference;

	constructor(public name: string) {}
}
