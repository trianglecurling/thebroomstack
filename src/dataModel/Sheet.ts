import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { Match } from "./Match";

@(entity.name("sheet").collectionName("sheets"))
export class Sheet implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@(t.array(() => Match).backReference()) public matches?: Match[];

	constructor(@t public name: string, @t public color1: string, @t public color2: string) {}
}
