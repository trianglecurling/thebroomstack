import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { User } from "./User";

@(entity.name("invoice").collection("invoices"))
export class Invoice implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public payPalInvoiceId?: string;

	public user?: User & Reference;

	constructor(
		public invoiceNum: number,
		public dueDate: Date,
		public invoiceAmount: number,
		public amountPaid: number
	) {}
}
