export type LeagueKey =
	| "mon"
	| "tue"
	| "wedD"
	| "wedE"
	| "wedL"
	| "thuE"
	| "thuL"
	| "fri"
	| "sat"
	| "sunM"
	| "sunD"
	| "soc"
	| "socDues";
export type SeasonKey = "f2019" | "w2020" | "f2020" | "f2021" | "w2021";

export type LeagueMembership = {
	dateJoined?: Date;
	dateRemoved?: Date;
	comments?: string;
};

export type LeagueData = {
	[league in LeagueKey]: LeagueMembership;
};

export type Leagues = {
	[season in SeasonKey]: LeagueData;
};

export interface Invoice {
	invoiceNum: string;
	payPalInvoiceId: string;
	invoiceAmount: number;
	amountPaid: number;
}

export type Dues = { [season: string]: Invoice[] };

export interface EmergencyContact {
	name: string;
	phone: string;
	relationship: string;
}

export interface Address {
	line1: string;
	line2: string;
	city: string;
	state: string;
	zip: string;
}

export interface ParentContact {
	name?: string;
	phone?: string;
	email?: string;
}

export interface Member {
	name: string;
	firstName: string;
	lastName: string;
	nicknames: string[];
	username: string | null;
	email: string | null;
	parentContact?: ParentContact;
	memberSince: Date | null;
	dateOfBirth: Date | null;
	yearsCurled: number | null;
	address: Address | null;
	phone: string | null;
	emergencyContact: EmergencyContact | null;
	gender: string | null;
	occupation: string | null;
	school: string | null;
	leagues: Leagues;
	dues: Dues;
	lifetime?: boolean;
}

export const enum LeagueFormat {
	BringYourOwnTeam,
	LeagueCoordinatorFormed,
	HatDraw,
	Instructional,
	Doubles,
	JuniorRecreational,
	JuniorAC,
	Social,
}

export interface League {
	key: string;
	name: string;
	dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | -1;
	format: LeagueFormat;
	drawTimes: string[];
	capacity: number;
	color: string;
	divisions?: string[];
	singleLeagueCost?: number;
	additionalLeagueCost?: number;
}
