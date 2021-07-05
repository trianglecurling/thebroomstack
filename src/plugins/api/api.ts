import { FastifyPluginAsync } from "fastify";
import { Address } from "../../dataModel/Address";
// import { User, Address } from "../../schema";
import { User } from "../../dataModel/User";
import { AddressesController } from "./controllers/addressesController";
import { ClubsController } from "./controllers/clubsController";
import { DivisionsController } from "./controllers/divisionsController";
import { DrawsController } from "./controllers/drawsController";
import { DrawTimesController } from "./controllers/drawTimesController";
import { EmergencyContactsController } from "./controllers/emergencyContactsController";
import { InvoicesController } from "./controllers/invoicesController";
import { LeagueFormatsController } from "./controllers/leagueFormatsController";
import { LeagueMembershipsController } from "./controllers/leagueMembershipsController";
import { LeaguesController } from "./controllers/leaguesController";
import { LeagueTeamsController } from "./controllers/leagueTeamsController";
import { MatchesController } from "./controllers/matchesController";
import { ParentContactsController } from "./controllers/parentContactsController";
import { PlayerClubsController } from "./controllers/playerClubsController";
import { PlayersController } from "./controllers/playersController";
import { SeasonsController } from "./controllers/seasonsController";
import { SheetsController } from "./controllers/sheetsController";
import { SpareCandidatesController } from "./controllers/spareCandidatesController";
import { TeamsController } from "./controllers/teamsController";
import { UserParentContactsController } from "./controllers/userParentContactsController";
import { UsersController } from "./controllers/usersController";
import { EntitiesController } from "./controllers/entitiesController";

export const ApiPlugin: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("onRequest", async (request, reply) => {
		request.isApiRequest = true;
	});
	await fastify.register(DivisionsController, { prefix: "divisions" });
	await fastify.register(DrawsController, { prefix: "draws" });
	await fastify.register(LeagueFormatsController, { prefix: "leagueFormats" });
	await fastify.register(LeaguesController, { prefix: "leagues" });
	await fastify.register(SeasonsController, { prefix: "seasons" });
	await fastify.register(AddressesController, { prefix: "addresses" });
	await fastify.register(ClubsController, { prefix: "clubs" });
	await fastify.register(DrawTimesController, { prefix: "drawTimes" });
	await fastify.register(EmergencyContactsController, {
		prefix: "emergencyContacts",
	});
	await fastify.register(InvoicesController, { prefix: "invoices" });
	await fastify.register(LeagueMembershipsController, {
		prefix: "leagueMemberships",
	});
	await fastify.register(LeagueTeamsController, { prefix: "leagueTeams" });
	await fastify.register(MatchesController, { prefix: "matches" });
	await fastify.register(ParentContactsController, { prefix: "parentContacts" });
	await fastify.register(PlayerClubsController, { prefix: "playerClubs" });
	await fastify.register(PlayersController, { prefix: "players" });
	await fastify.register(SheetsController, { prefix: "sheets" });
	await fastify.register(SpareCandidatesController, { prefix: "spareCandidates" });
	await fastify.register(TeamsController, { prefix: "teams" });
	await fastify.register(UserParentContactsController, {
		prefix: "userParentContacts",
	});
	await fastify.register(UsersController, { prefix: "users" });
	await fastify.register(EntitiesController, { prefix: "entities" });
};
