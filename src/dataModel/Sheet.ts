import { AutoIncrement, BackReference, entity, PrimaryKey } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { Match } from "./Match";

@(entity.name("sheet").collection("sheets"))
export class Sheet implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public matches?: Match[] & BackReference;

	constructor(public name: string, public color1: string, public color2: string) {}
}
