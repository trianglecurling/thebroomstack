import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { League } from "./League";

@(entity.name("division").collectionName("divisions"))
export class Division implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@(t.type(() => League).reference()) public league?: League;

	constructor(@t public name: string) {}
}
