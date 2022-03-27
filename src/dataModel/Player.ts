import { AutoIncrement, BackReference, entity, PrimaryKey, Reference } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { Club } from "./Club";
import { User } from "./User";
import { PlayerClub } from "./joinerObjects/PlayerClub";

@(entity.name("player").collection("players"))
export class Player implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public name?: string;

	public user?: User & Reference;

	clubs?: Club[] & BackReference<{via: PlayerClub}>;

	constructor() {}
}
