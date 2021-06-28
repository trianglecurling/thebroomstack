import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";

@(entity.name("season").collectionName("seasons"))
export class Season implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@(t.array(() => League).backReference()) public leagues?: League[];

	constructor(
		@t public name: string,
		@t public startDate: Date,
		@t public endDate: Date
	) {}
}
