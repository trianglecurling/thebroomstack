import { SQLiteDatabaseAdapter } from "@deepkit/sqlite";
import { Database } from "@deepkit/orm";

import { User } from "./User";
import { Address } from "./Address";
import { EmergencyContact } from "./EmergencyContact";
import { ParentContact } from "./ParentContact";
import { League } from "./League";
import { LeagueFormat } from "./LeagueFormat";
import { Draw } from "./Draw";
import { DrawTime } from "./DrawTime";
import { Division } from "./Division";
import { Invoice } from "./Invoice";
import { Match } from "./Match";
import { Team } from "./Team";
import { Sheet } from "./Sheet";
import { Player } from "./Player";
import { Club } from "./Club";
import { Season } from "./Season";

import { UserParentContact } from "./joinerObjects/UserParentContact";
import { LeagueMembership } from "./joinerObjects/LeagueMembership";
import { SpareCandidate } from "./joinerObjects/SpareCandidate";
import { LeagueTeam } from "./joinerObjects/LeagueTeam";
import { PlayerClub } from "./joinerObjects/PlayerClub";
import { AppConfig } from "../appConfig";

import { injectable } from "@deepkit/injector";

import path from "path";

class DatabaseSettings extends AppConfig.slice(["dbPath"]) {}

@injectable()
export class TheBroomstackDatabase extends Database {
	name = "default";
	constructor(protected settings: DatabaseSettings) {
		super(new SQLiteDatabaseAdapter(path.resolve(__dirname, "..", "..", settings.dbPath)), [
			// Data objects
			User,
			Address,
			EmergencyContact,
			ParentContact,
			League,
			LeagueFormat,
			Draw,
			DrawTime,
			Division,
			Invoice,
			Match,
			Team,
			Sheet,
			Player,
			Club,
			Season,

			// Association objects
			UserParentContact,
			LeagueMembership,
			SpareCandidate,
			LeagueTeam,
			PlayerClub,
		]);
	}
}
