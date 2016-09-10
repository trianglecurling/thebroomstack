import jsdom = require("jsdom");
import request = require("request");
import http = require("http");
import Q = require("q");
import _ = require("lodash");

interface Cookie {
	key: string;
	value: string;
	path: string;
	other: string;
}

function parseCookie(cookie: string): Cookie {
	const pieces = cookie.split(";").map(p => p.trim());
	const keyval = pieces[0].split("=");
	return {
		key: keyval[0],
		value: keyval[1],
		path: pieces[1],
		other: pieces[2]
	};
}

if (process.argv.length < 4) {
	console.log("USAGE: node schedule-scraper <username> <password>");
	process.exit(-1);
}
if (process.argv.indexOf("--fiddler") >= 0) {
	process.env.HTTP_PROXY = "http://127.0.0.1:8888";
}

interface Game {
	time: Date;
	sheet: string;
	league: string;
	team1: Team | string;
	team2: Team | string;
}

interface TeamRef {
	skip: string;
	league: string;
}

interface Team {
	name: string;
	league: string;
	lead: string;
	second: string;
	vice: string;
	skip: string;
}

const site = "http://trianglecurling.com";
const timeRE = /(\d\d?):(\d\d) ((?:P|A)M)/;
const todaysGames: Game[] = [];

let skipRosters = false;
if (process.argv.indexOf("--skip-rosters") >= 0) {
	skipRosters = true;
}

console.log("Navigate to admin login screen...");
request.get(`${site}/administrator`, {}, (error: any, response: http.IncomingMessage, body: any) => {
	console.log("Logging in...");
	const sessionCookie = parseCookie(response.headers["set-cookie"][0]);

	// Parse the body
	jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], null, (errors: Error[], window: any) => {
		// Find the CSRF token & other hidden params.
		const $ = window.$;
		const hidden: {[key: string]: string} = {};
		$("input[type=hidden]").each((index: number, element: any) => {
			hidden[$(element).attr("name")] = $(element).attr("value");
		});
		let formEncode = "";
		Object.keys(hidden).forEach(k => {
			formEncode += "&" + k + "=" + hidden[k];
		});

		// POST login
		const username = process.argv[2];
		const password = process.argv[3];

		const stdHeaders = {
			"Cookie": `${sessionCookie.key}=${sessionCookie.value}`,
			"Content-Type": "application/x-www-form-urlencoded",
			"Origin": "http://trianglecurling.com",
			"Accept-Language": "en-US,en;q=0.8",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36"
		};

		request.post(`${site}/administrator/index.php`, {
			headers: stdHeaders,
			body: `username=${username}&passwd=${password}${formEncode}`
		}, (error: any, response: http.IncomingMessage, body: any) => {
			console.log("Logged in. Redirecting...");

			// Now a GET request to the Location header.
			request.get(response.headers["location"], { headers: stdHeaders }, (error: any, response: http.IncomingMessage, body: any) => {
				console.log("Navigating to curling manager main page...")

				// Get the main page, which has Today's Scheduled Games
				request.get(`${site}/administrator/index.php?option=com_curling`, {headers: stdHeaders}, (error: any, response: http.IncomingMessage, body: any) => {
					console.log("Scraping game data...");

					jsdom.env(body, [], (errors: Error[], window: any) => {
						const document = window.document;
						const table = document.querySelector("table.table-striped");
						if (!table) {
							console.log("There are no ice bookings in the schedule for today.");
						} else {
							const rows = table.querySelectorAll("tbody tr");
							let currentLeague = "";
							for (let i = 0; i < rows.length; ++i) {
								const row = rows.item(i);
								let timeCell = row.querySelectorAll("td").item(0);
								const timeColSpan = parseInt(timeCell.getAttribute("colspan"));
								
								// This is a header row.
								if (timeColSpan && timeColSpan > 1) {
									currentLeague = timeCell.textContent.trim();
									continue; // continue;
								}
								
								const time = timeCell.textContent;
								const [fullTime, hour, minute, meridian] = timeRE.exec(time);
								const curDate = new Date();
								const dateTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), parseInt(hour, 10) % 12 + (meridian === "PM" ? 12 : 0), parseInt(minute, 10));
								const sheet: string = row.querySelectorAll("td").item(1).textContent.trim();
								if (["A", "B", "C", "D"].indexOf(sheet) === -1) {
									continue; // continue
								}
								const teams = row.querySelectorAll("td").item(2).textContent.trim();
								const [team1, team2] = teams.split("vs").map((t: string) => t.trim());
								todaysGames.push({
									time: dateTime,
									league: currentLeague,
									sheet: sheet,
									team1: team1,
									team2: team2
								});
							}

							if (!skipRosters) {
								const teamsToFetch: TeamRef[] = todaysGames.map(g => ({skip: g.team1 as string, league: g.league})).concat(todaysGames.map(g => ({skip: g.team2 as string, league: g.league})));
								console.log(`Finished games. Now fetching teams rosters for ${teamsToFetch.map(t => t.skip).join("; ")}...`);
								const teamScraper = new TeamScraper(stdHeaders);
								teamScraper.getTeams(teamsToFetch).then((teams) => {
									for (const game of todaysGames) {
										game.team1 = teams[game.team1 as string + "|" + game.league];
										game.team2 = teams[game.team2 as string + "|" + game.league];
									}
									console.log("Today's games: ");
									console.log(JSON.stringify(todaysGames, null, 4));
								});
							} else {
								console.log("Today's games: ");
								console.log(JSON.stringify(todaysGames, null, 4));
							}
						}
					});
				});
			});
		});
	});
});

interface League {
	name: string;
	day: number;
	hour: number;
	minute: number;
}

const leagues: League[] = [
	{
		name: "Sunday Morning Open - Fall 2016",
		day: 0,
		hour: 11,
		minute: 0
	},
	{
		name: "Sunday Doubles - Fall 2016",
		day: 0,
		hour: 18,
		minute: 0
	},
	{
		name: "Monday Spinner - Fall 2016",
		day: 1,
		hour: 19,
		minute: 0
	},
	{
		name: "Tuesday Open - Fall 2016",
		day: 2,
		hour: 19,
		minute: 0
	},
	{
		name: "Wednesday Open - 6:15 p.m. Draw - Fall 2016",
		day: 3,
		hour: 18,
		minute: 15
	},
	{
		name: "Wednesday Open - 8:30 p.m. Draw - Fall 2016",
		day: 3,
		hour: 20,
		minute: 30
	},
	{
		name: "Thursday Open - Fall 2016",
		day: 4,
		hour: 19,
		minute: 0
	}
];

function getNextLeague(fromDate: Date = null): League {
	if (!fromDate) {
		// 3 hours in the past.
		const now = new Date(new Date().getTime() - 180 * 60 * 1000);
		return getNextLeague(now);
	}

	// This is me being super lazy.
	let current = fromDate;
	for (let i = 0; i < 525600 /*1 year*/; ++i) {
		const minute = current.getMinutes();
		const hour = current.getHours();
		const day = current.getDay();
		for (const league of leagues) {
			if (league.day === day && league.hour === hour && league.minute === minute) {
				return league;
			}
		}
		current = new Date(current.getTime() + 60000);
	}
}

class TeamScraper {
	private leagueIds: {[league: string]: number} = null;

	constructor(private headers: any) { }

	public getTeams(teams: TeamRef[]): Q.Promise<{[skip: string]: Team}> {
		const leagues = _.uniq(teams.map(t => t.league));

		return this.ensureTeamIds().then(() => {
			return Q.Promise<{[skip: string]: Team}>((outerResolve, reject) => {
				const leaguePromises: Q.Promise<{[skip: string]: Team}>[] = [];
				for (const leagueName of leagues) {
					const leaguePromise = Q.Promise<{[skip: string]: Team}>((resolve, reject) => {
						console.log(`Navigating to teams page for league ${leagueName}...`);
						request.get(`${site}/administrator/index.php?task=teams&option=com_curling&league_id=${this.leagueIds[leagueName]}`, {headers: this.headers}, (error: any, response: http.IncomingMessage, body: any) => {
							jsdom.env(body, [], (errors: Error[], window: any) => {
								const document = window.document;
								const rows = document.querySelectorAll("table.table-striped tbody tr");
								const teamPromises: Q.Promise<Team>[] = [];
								for (const skip of teams.filter(t => t.league === leagueName).map(t => t.skip)) {
									for (let i = 0; i < rows.length; ++i) {
										const row = rows.item(i);
										const cells = row.querySelectorAll("td");
										const teamSkip = cells.item(3).textContent.trim();
										if (teamSkip === skip) {
											const url = `${site}/administrator/${cells.item(3).querySelectorAll("a")[0].href}`;
											const teamPromise = this.getTeam(url, leagueName);
											teamPromises.push(teamPromise);
										}
									}
								}
								return Q.all(teamPromises).then((teams) => {
									console.log(`All teams discovered for league ${leagueName}.`);
									const teamsObj: {[skip: string]: Team} = {};
									for (const team of teams) {
										teamsObj[team.skip] = team;
									}
									resolve(teamsObj);
								});
							});
						});
					});
					leaguePromises.push(leaguePromise);
				}
				Q.all(leaguePromises).then((foundTeams) => {
					const result: {[leagueSkip: string]: Team} = {};
					for (const teams of foundTeams) {
						Object.keys(teams).forEach(skip => {
							result[skip + "|" + teams[skip].league] = teams[skip];
						});
					}
					outerResolve(result);
				});
			});
		});
	}

	private getTeam(url: string, league: string): Q.Promise<Team> {
		return Q.Promise<Team>((resolve, reject) => {
			console.log("Getting requested team...");
			request.get(url, {headers: this.headers}, (error: any, response: http.IncomingMessage, body: any) => {
				jsdom.env(body, [], (errors: Error[], window: any) => {
					const document = window.document;
					const name = (document.querySelector("input[name=team_name]") as HTMLInputElement).value;
					const selects = document.querySelectorAll("select");
					const s1val = selects.item(1).value;
					const s2val = selects.item(2).value;
					const s3val = selects.item(3).value;
					const s4val = selects.item(4).value;
					const skip = s1val === "0" ? null : document.querySelectorAll(`option[value='${ s1val }']`).item(0).textContent;
					const vice = s2val === "0" ? null : document.querySelectorAll(`option[value='${ s2val }']`).item(0).textContent;
					const second = s3val === "0" ? null : document.querySelectorAll(`option[value='${ s3val }']`).item(0).textContent;
					const lead = s4val === "0" ? null : document.querySelectorAll(`option[value='${ s4val }']`).item(0).textContent;
					console.log(`Found team ${name}`);
					resolve({name: name, lead: lead, second: second, vice: vice, skip: skip, league: league});
				});
			});
		});
	}

	private ensureTeamIds(): Q.Promise<void> {
		if (this.leagueIds) {
			return Q.resolve<void>(null);
		}
		console.log("Discovering internal team ids...");
		this.leagueIds = {};
		return Q.Promise<void>((resolve, reject) => {
			request.get(`${site}/administrator/index.php?task=teams&option=com_curling`, {headers: this.headers}, (error: any, response: http.IncomingMessage, body: any) => {
				jsdom.env(body, [], (errors: Error[], window: any) => {
					const document = window.document;
					const options = document.querySelectorAll("select[name=league_id] option");
					for (let i = 0; i < options.length; ++i) {
						const element = options.item(i);
						const optionVal = element.getAttribute("value");
						if (optionVal === "0") {
							continue; // continue;
						}
						this.leagueIds[element.textContent] = parseInt(optionVal, 10);
					}
					console.log("Team ids found.");
					resolve(null);
				});
			});
		});
	}
}
