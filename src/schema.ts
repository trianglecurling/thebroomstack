import fp from "fastify-plugin";
import { Model, DataTypes } from "sequelize";

export class User extends Model {}
export class Address extends Model {}
export class EmergencyContact extends Model {}
export class ParentContact extends Model {}
export class League extends Model {}
export class LeagueFormat extends Model {}
export class LeagueMembership extends Model {}
export class Draw extends Model {}
export class DrawTime extends Model {}
export class Division extends Model {}
export class Invoice extends Model {}
export class Match extends Model {}
export class Team extends Model {}
export class Sheet extends Model {}
export class Player extends Model {}
export class Club extends Model {}
export class Season extends Model {}

export default fp(async (fastify, opts) => {
	Season.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			startDate: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			endDate: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Season",
		}
	);

	// A single instance of a draw, i.e. on a particular
	// date at a particular time
	Draw.init(
		{
			date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Draw",
		}
	);

	// A recurring draw time within a league, i.e. Mondays at 4pm
	DrawTime.init(
		{
			time: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			dayOfWeek: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "DrawTime",
		}
	);
	Club.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Club",
		}
	);
	Player.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Player",
		}
	);
	Team.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Team",
		}
	);
	Sheet.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			color1: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			color2: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Sheet",
		}
	);
	Match.init(
		{
			date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			state: {
				type: DataTypes.JSON,
				allowNull: true,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Match",
		}
	);
	LeagueMembership.init(
		{
			dateJoined: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			dateRemoved: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			comments: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "LeagueMembership",
		}
	);
	Invoice.init(
		{
			invoiceNum: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			payPalInvoiceId: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			dueDate: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			invoiceAmount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			amountPaid: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Invoice",
		}
	);
	Division.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Division",
		}
	);
	LeagueFormat.init(
		{
			format: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			playersPerTeam: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "LeagueFormat",
		}
	);
	League.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			dayOfWeek: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
			teamCapacity: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
			singleLeagueCost: {
				type: DataTypes.SMALLINT,
				allowNull: true,
			},
			additionalLeagueCost: {
				type: DataTypes.SMALLINT,
				allowNull: true,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "League",
		}
	);
	ParentContact.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "ParentContact",
		}
	);
	EmergencyContact.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			relationship: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "EmergencyContact",
		}
	);
	Address.init(
		{
			line1: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			line2: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			state: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			zip: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize: fastify.sequelize,
			modelName: "Address",
		}
	);
	User.init(
		{
			// Model attributes are defined here
			fullName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			friendlyName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ccmUserName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			memberSince: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			curledSince: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			dateOfBirth: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			gender: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			occupation: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			school: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize: fastify.sequelize,
			// We need to choose the model name
			modelName: "User",
		}
	);

	// Model relationships

	// Augmented user info
	User.belongsTo(Address);
	Address.hasOne(User);
	User.hasOne(EmergencyContact);
	User.belongsToMany(ParentContact, { through: "UserParentContact" });
	ParentContact.belongsToMany(User, { through: "UserParentContact" });
	EmergencyContact.belongsTo(User);
	User.hasMany(Invoice);
	Invoice.belongsTo(User);

	// Users, Leagues, and Teams
	User.belongsToMany(League, {
		through: LeagueMembership,
		foreignKey: "userId",
	});
	League.belongsToMany(User, {
		through: LeagueMembership,
		foreignKey: "leagueId",
	});
	League.belongsToMany(Team, { through: "LeagueTeam" });
	Team.belongsToMany(League, { through: "LeagueTeam" });

	// League relationships
	League.belongsTo(LeagueFormat);
	League.hasMany(Draw);
	Draw.belongsTo(League);
	Draw.hasMany(Match);
	Match.belongsTo(Draw);
	League.hasMany(Division);
	Division.belongsTo(League);
	League.hasMany(DrawTime);
	DrawTime.belongsTo(League);
    League.belongsTo(Season);
    Season.hasMany(League);

	// Matches
	Match.belongsTo(Sheet);
	Match.belongsTo(Team, { as: "Team1" });
	Match.belongsTo(Team, { as: "Team2" });

	// Players, clubs, teams
	Player.belongsToMany(Club, { through: "PlayerClub" });
	Club.belongsToMany(Player, { through: "PlayerClub" });
	Player.belongsTo(User);
	Team.belongsTo(Player, { as: "Lead" });
	Team.belongsTo(Player, { as: "Second" });
	Team.belongsTo(Player, { as: "Vice" });
	Team.belongsTo(Player, { as: "Skip" });
	Team.belongsTo(Player, { as: "Alt1" });
	Team.belongsTo(Player, { as: "Alt2" });
	Team.belongsTo(Player, { as: "Coach" });
	Team.belongsTo(Player, { as: "Doubles1" });
	Team.belongsTo(Player, { as: "Doubles2" });
	User.belongsToMany(DrawTime, { through: "SpareCandidates" });
	DrawTime.belongsToMany(User, { through: "SpareCandidates" });

	await fastify.sequelize.sync();
});
