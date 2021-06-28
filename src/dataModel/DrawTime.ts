import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { User } from "./User";
import { SpareCandidate } from "./joinerObjects/SpareCandidate";

@(entity.name("drawTime").collectionName("drawTimes"))
export class DrawTime implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@(t.array(() => User).backReference({ via: () => SpareCandidate }))
	availableSpares?: User[];

	constructor(@t public time: string, @t public dayOfWeek: number) {}
}
