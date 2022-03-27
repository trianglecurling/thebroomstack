import { AutoIncrement, BackReference, entity, PrimaryKey } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { User } from "./User";
import { SpareCandidate } from "./joinerObjects/SpareCandidate";

@(entity.name("drawTime").collection("drawTimes"))
export class DrawTime implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	availableSpares?: User[] & BackReference<{via: SpareCandidate}>;

	constructor(public time: string, public dayOfWeek: number) {}
}
