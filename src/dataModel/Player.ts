import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { Club } from "./Club";
import { User } from "./User";
import { PlayerClub } from "./joinerObjects/PlayerClub";

@(entity.name("player").collectionName("players"))
export class Player implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public name?: string;

	@(t.type(() => User).reference()) public user?: User;

	@(t.array(() => Club).backReference({ via: () => PlayerClub }))
	clubs?: Club[];

	constructor() {}
}
