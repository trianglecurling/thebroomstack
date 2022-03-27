import { AutoIncrement, BackReference, entity, PrimaryKey, Reference } from "@deepkit/type";
import { EmergencyContact } from "./EmergencyContact";
import { IDataObject } from "../types/data";
import { Address } from "./Address";
import { Invoice } from "./Invoice";
import { League } from "./League";
import { ParentContact } from "./ParentContact";
import { DrawTime } from "./DrawTime";
import { LeagueMembership } from "./joinerObjects/LeagueMembership";
import { UserParentContact } from "./joinerObjects/UserParentContact";
import { SpareCandidate } from "./joinerObjects/SpareCandidate";

@(entity.name("user").collection("users"))
export class User implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public gender?: string;
	public occupation?: string;
	public school?: string;
	public ccmUserName?: string;

	public invoices?: Invoice[] & BackReference;
	public address?: Address & Reference;

	public emergencyContact?: EmergencyContact & Reference;

	parentContacts?: ParentContact[] & BackReference<{via: UserParentContact}>;

	leagues?: League[] & BackReference<{via: LeagueMembership}>;

	spareAvailability?: DrawTime[] & BackReference<{via: SpareCandidate}>;

	constructor(
		public fullName: string,
		public friendlyName: string,
		public email: string,
		public memberSince: Date,
		public curledSince: Date,
		public dateOfBirth: Date,
		public phone: string
	) {}
}
