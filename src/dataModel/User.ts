import { entity, t } from "@deepkit/type";
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

@(entity.name("user").collectionName("users"))
export class User implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public gender?: string;
	@t public occupation?: string;
	@t public school?: string;
	@t public ccmUserName?: string;

	@(t.array(() => Invoice).backReference()) public invoices?: Invoice[];
	@(t.type(() => Address).reference()) public address?: Address;
    
	@(t.type(() => EmergencyContact).reference())
	public emergencyContact?: EmergencyContact;

	@(t
		.array(() => ParentContact)
		.backReference({ via: () => UserParentContact }))
	parentContacts?: ParentContact[];

	@(t.array(() => League).backReference({ via: () => LeagueMembership }))
	leagues?: League[];

	@(t.array(() => DrawTime).backReference({ via: () => SpareCandidate }))
	spareAvailability?: DrawTime[];

	constructor(
		@t public fullName: string,
		@t public friendlyName: string,
		@t public email: string,
		@t public memberSince: Date,
		@t public curledSince: Date,
		@t public dateOfBirth: Date,
		@t public phone: string
	) {}
}
