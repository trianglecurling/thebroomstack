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

					jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], (errors: Error[], window: any) => {
						const $ = window.$;
						const $table = $("table.table-striped");
						if ($table.length === 0) {
							console.log("There are no ice bookings in the schedule for today.");
						} else {
							const $rows = $table.find("tbody tr");
							let currentLeague = "";
							$rows.each((index: number, row: any) => {
								const $row = $(row);
								let $timeCell = $row.find("td").eq(0);
								const timeColSpan = $timeCell.attr("colspan");
								if (timeColSpan && timeColSpan > 1) {
									currentLeague = $timeCell.text().trim();
									return true; // continue;
								}

								const time = $timeCell.text();
								const [fullTime, hour, minute, meridian] = timeRE.exec(time);
								const curDate = new Date();
								const dateTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), parseInt(hour, 10) % 12 + (meridian === "PM" ? 12 : 0), parseInt(minute, 10));
								const sheet: string = $row.find("td").eq(1).text().trim();
								if (["A", "B", "C", "D"].indexOf(sheet) === -1) {
									return true; // continue
								}
								const teams = $row.find("td").eq(2).text().trim();
								const [team1, team2] = teams.split("vs").map((t: string) => t.trim());
								todaysGames.push({
									time: dateTime,
									league: currentLeague,
									sheet: sheet,
									team1: team1,
									team2: team2
								});
							});

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
		name: "Sunday Morning Open - Winter 2016",
		day: 0,
		hour: 11,
		minute: 0
	},
	{
		name: "Sunday Doubles - Winter 2016",
		day: 0,
		hour: 18,
		minute: 0
	},
	{
		name: "Monday Spinner - Winter 2016",
		day: 1,
		hour: 19,
		minute: 0
	},
	{
		name: "Tuesday Competitive - Winter 2016",
		day: 2,
		hour: 19,
		minute: 0
	},
	{
		name: "Wednesday Open - Winter 2016",
		day: 3,
		hour: 18,
		minute: 30
	},
	{
		name: "Thursday Open - Winter 2016",
		day: 4,
		hour: 19,
		minute: 0
	}
];

function getNextLeague(from: Date = null): League {
	if (!from) {
		// 3 hours in the past.
		const now = new Date(new Date().getTime() - 180 * 60 * 1000);
		return getNextLeague(now);
	}

	// This is me being super lazy.
	let current = from;
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
							jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], (errors: Error[], window: any) => {
								const $ = window.$;
								const $rows = $("table.table-striped tbody tr");
								const teamPromises: Q.Promise<Team>[] = [];
								for (const skip of teams.filter(t => t.league === leagueName).map(t => t.skip)) {
									$rows.each((index: number, row: Element) => {
										const $cells = $(row).find("td");
										const teamSkip = $cells.eq(3).text().trim();
										if (teamSkip === skip) {
											const url = `${site}/administrator/${$cells.eq(3).find("a")[0].href}`;
											const teamPromise = this.getTeam(url, leagueName);
											teamPromises.push(teamPromise);
										}
									});
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
				jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], (errors: Error[], window: any) => {
					const $ = window.$;
					const name = $("input[name=team_name]").val();
					const s1val = $("select").eq(1).val();
					const s2val = $("select").eq(2).val();
					const s3val = $("select").eq(3).val();
					const s4val = $("select").eq(4).val();
					const skip = s1val === "0" ? null : $(`option[value=${ s1val }]`).eq(0).text();
					const vice = s2val === "0" ? null : $(`option[value=${ s2val }]`).eq(0).text();
					const second = s3val === "0" ? null : $(`option[value=${ s3val }]`).eq(0).text();
					const lead = s4val === "0" ? null : $(`option[value=${ s4val }]`).eq(0).text();
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
				jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], (errors: Error[], window: any) => {
					const $ = window.$;
					const $options = $("select[name=league_id] option");
					$options.each((index: number, element: Element) => {
						const optionVal = $(element).attr("value");
						if (optionVal === "0") {
							return true; // continue;
						}
						this.leagueIds[$(element).text()] = parseInt(optionVal, 10);
					});
					console.log("Team ids found.");
					resolve(null);
				});
			});
		});
	}
}
