import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";
import { Match } from "./Match";

@(entity.name("draw").collectionName("draws"))
export class Draw implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@(t.type(() => League).reference()) public league?: League;

	@(t.array(() => Match).backReference()) public matches?: Match[];

	// @(t.type(() => Event).reference()) public event?: Event;

	constructor(@t public date: Date) {}
}
