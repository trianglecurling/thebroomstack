import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { User } from "./User";

@(entity.name("invoice").collectionName("invoices"))
export class Invoice implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public payPalInvoiceId?: string;

	@(t.type(() => User).reference()) public user?: User;

	constructor(
		@t public invoiceNum: number,
		@t public dueDate: Date,
		@t public invoiceAmount: number,
		@t public amountPaid: number
	) {}
}
