import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";

@(entity.name("address").collectionName("addresses"))
export class Address implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public line2?: string;

	constructor(@t public line1: string, @t public city: string, @t public state: string, @t public zip: string) {}
}
