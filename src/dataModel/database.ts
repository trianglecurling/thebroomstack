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

import path from "path";

export class TheBroomstackDatabase extends Database {
	name = "default";
	constructor(dbPath: AppConfig['dbPath']) {
		super(new SQLiteDatabaseAdapter(path.resolve(__dirname, "..", "..", dbPath)), [
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
