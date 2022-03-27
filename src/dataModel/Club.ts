import { AutoIncrement, BackReference, entity, PrimaryKey } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { Player } from "./Player";
import { PlayerClub } from "./joinerObjects/PlayerClub";

@(entity.name("club").collection("clubs"))
export class Club implements IDataObject {
	public id: number& PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	players?: Player[] & BackReference<{via: PlayerClub}>;

	constructor(public name: string) {}
}
