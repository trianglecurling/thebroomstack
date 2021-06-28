import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { Player } from "./Player";
import { PlayerClub } from "./joinerObjects/PlayerClub";

@(entity.name("club").collectionName("clubs"))
export class Club implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@(t.array(() => Player).backReference({ via: () => PlayerClub }))
	players?: Player[];

	constructor(@t public name: string) {}
}
