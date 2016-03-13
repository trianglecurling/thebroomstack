"use strict";
var jsdom = require("jsdom");
var request = require("request");
var Q = require("q");
var _ = require("lodash");
function parseCookie(cookie) {
    var pieces = cookie.split(";").map(function (p) { return p.trim(); });
    var keyval = pieces[0].split("=");
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
var site = "http://trianglecurling.com";
var timeRE = /(\d\d?):(\d\d) ((?:P|A)M)/;
var todaysGames = [];
var skipRosters = false;
if (process.argv.indexOf("--skip-rosters") >= 0) {
    skipRosters = true;
}
console.log("Navigate to admin login screen...");
request.get(site + "/administrator", {}, function (error, response, body) {
    console.log("Logging in...");
    var sessionCookie = parseCookie(response.headers["set-cookie"][0]);
    jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], null, function (errors, window) {
        var $ = window.$;
        var hidden = {};
        $("input[type=hidden]").each(function (index, element) {
            hidden[$(element).attr("name")] = $(element).attr("value");
        });
        var formEncode = "";
        Object.keys(hidden).forEach(function (k) {
            formEncode += "&" + k + "=" + hidden[k];
        });
        var username = process.argv[2];
        var password = process.argv[3];
        var stdHeaders = {
            "Cookie": sessionCookie.key + "=" + sessionCookie.value,
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "http://trianglecurling.com",
            "Accept-Language": "en-US,en;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36"
        };
        request.post(site + "/administrator/index.php", {
            headers: stdHeaders,
            body: "username=" + username + "&passwd=" + password + formEncode
        }, function (error, response, body) {
            console.log("Logged in. Redirecting...");
            request.get(response.headers["location"], { headers: stdHeaders }, function (error, response, body) {
                console.log("Navigating to curling manager main page...");
                request.get(site + "/administrator/index.php?option=com_curling", { headers: stdHeaders }, function (error, response, body) {
                    console.log("Scraping game data...");
                    jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], function (errors, window) {
                        var $ = window.$;
                        var $table = $("table.table-striped");
                        if ($table.length === 0) {
                            console.log("There are no ice bookings in the schedule for today.");
                        }
                        else {
                            var $rows = $table.find("tbody tr");
                            var currentLeague_1 = "";
                            $rows.each(function (index, row) {
                                var $row = $(row);
                                var $timeCell = $row.find("td").eq(0);
                                var timeColSpan = $timeCell.attr("colspan");
                                if (timeColSpan && timeColSpan > 1) {
                                    currentLeague_1 = $timeCell.text().trim();
                                    return true;
                                }
                                var time = $timeCell.text();
                                var _a = timeRE.exec(time), fullTime = _a[0], hour = _a[1], minute = _a[2], meridian = _a[3];
                                var curDate = new Date();
                                var dateTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), parseInt(hour, 10) % 12 + (meridian === "PM" ? 12 : 0), parseInt(minute, 10));
                                var sheet = $row.find("td").eq(1).text().trim();
                                if (["A", "B", "C", "D"].indexOf(sheet) === -1) {
                                    return true;
                                }
                                var teams = $row.find("td").eq(2).text().trim();
                                var _b = teams.split("vs").map(function (t) { return t.trim(); }), team1 = _b[0], team2 = _b[1];
                                todaysGames.push({
                                    time: dateTime,
                                    league: currentLeague_1,
                                    sheet: sheet,
                                    team1: team1,
                                    team2: team2
                                });
                            });
                            if (!skipRosters) {
                                var teamsToFetch = todaysGames.map(function (g) { return ({ skip: g.team1, league: g.league }); }).concat(todaysGames.map(function (g) { return ({ skip: g.team2, league: g.league }); }));
                                console.log("Finished games. Now fetching teams rosters for " + teamsToFetch.map(function (t) { return t.skip; }).join("; ") + "...");
                                var teamScraper = new TeamScraper(stdHeaders);
                                teamScraper.getTeams(teamsToFetch).then(function (teams) {
                                    for (var _i = 0, todaysGames_1 = todaysGames; _i < todaysGames_1.length; _i++) {
                                        var game = todaysGames_1[_i];
                                        game.team1 = teams[game.team1 + "|" + game.league];
                                        game.team2 = teams[game.team2 + "|" + game.league];
                                    }
                                    console.log("Today's games: ");
                                    console.log(JSON.stringify(todaysGames, null, 4));
                                });
                            }
                            else {
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
var leagues = [
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
function getNextLeague(from) {
    if (from === void 0) { from = null; }
    if (!from) {
        var now = new Date(new Date().getTime() - 180 * 60 * 1000);
        return getNextLeague(now);
    }
    var current = from;
    for (var i = 0; i < 525600; ++i) {
        var minute = current.getMinutes();
        var hour = current.getHours();
        var day = current.getDay();
        for (var _i = 0, leagues_1 = leagues; _i < leagues_1.length; _i++) {
            var league = leagues_1[_i];
            if (league.day === day && league.hour === hour && league.minute === minute) {
                return league;
            }
        }
        current = new Date(current.getTime() + 60000);
    }
}
var TeamScraper = (function () {
    function TeamScraper(headers) {
        this.headers = headers;
        this.leagueIds = null;
    }
    TeamScraper.prototype.getTeams = function (teams) {
        var _this = this;
        var leagues = _.uniq(teams.map(function (t) { return t.league; }));
        return this.ensureTeamIds().then(function () {
            return Q.Promise(function (outerResolve, reject) {
                var leaguePromises = [];
                var _loop_1 = function(leagueName) {
                    var leaguePromise = Q.Promise(function (resolve, reject) {
                        console.log("Navigating to teams page for league " + leagueName + "...");
                        request.get(site + "/administrator/index.php?task=teams&option=com_curling&league_id=" + _this.leagueIds[leagueName], { headers: _this.headers }, function (error, response, body) {
                            jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], function (errors, window) {
                                var $ = window.$;
                                var $rows = $("table.table-striped tbody tr");
                                var teamPromises = [];
                                var _loop_2 = function(skip) {
                                    $rows.each(function (index, row) {
                                        var $cells = $(row).find("td");
                                        var teamSkip = $cells.eq(3).text().trim();
                                        if (teamSkip === skip) {
                                            var url = site + "/administrator/" + $cells.eq(3).find("a")[0].href;
                                            var teamPromise = _this.getTeam(url, leagueName);
                                            teamPromises.push(teamPromise);
                                        }
                                    });
                                };
                                for (var _i = 0, _a = teams.filter(function (t) { return t.league === leagueName; }).map(function (t) { return t.skip; }); _i < _a.length; _i++) {
                                    var skip = _a[_i];
                                    _loop_2(skip);
                                }
                                return Q.all(teamPromises).then(function (teams) {
                                    console.log("All teams discovered for league " + leagueName + ".");
                                    var teamsObj = {};
                                    for (var _i = 0, teams_1 = teams; _i < teams_1.length; _i++) {
                                        var team = teams_1[_i];
                                        teamsObj[team.skip] = team;
                                    }
                                    resolve(teamsObj);
                                });
                            });
                        });
                    });
                    leaguePromises.push(leaguePromise);
                };
                for (var _i = 0, leagues_2 = leagues; _i < leagues_2.length; _i++) {
                    var leagueName = leagues_2[_i];
                    _loop_1(leagueName);
                }
                Q.all(leaguePromises).then(function (foundTeams) {
                    var result = {};
                    var _loop_3 = function(teams_2) {
                        Object.keys(teams_2).forEach(function (skip) {
                            result[skip + "|" + teams_2[skip].league] = teams_2[skip];
                        });
                    };
                    for (var _i = 0, foundTeams_1 = foundTeams; _i < foundTeams_1.length; _i++) {
                        var teams_2 = foundTeams_1[_i];
                        _loop_3(teams_2);
                    }
                    outerResolve(result);
                });
            });
        });
    };
    TeamScraper.prototype.getTeam = function (url, league) {
        var _this = this;
        return Q.Promise(function (resolve, reject) {
            console.log("Getting requested team...");
            request.get(url, { headers: _this.headers }, function (error, response, body) {
                jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], function (errors, window) {
                    var $ = window.$;
                    var name = $("input[name=team_name]").val();
                    var s1val = $("select").eq(1).val();
                    var s2val = $("select").eq(2).val();
                    var s3val = $("select").eq(3).val();
                    var s4val = $("select").eq(4).val();
                    var skip = s1val === "0" ? null : $("option[value=" + s1val + "]").eq(0).text();
                    var vice = s2val === "0" ? null : $("option[value=" + s2val + "]").eq(0).text();
                    var second = s3val === "0" ? null : $("option[value=" + s3val + "]").eq(0).text();
                    var lead = s4val === "0" ? null : $("option[value=" + s4val + "]").eq(0).text();
                    console.log("Found team " + name);
                    resolve({ name: name, lead: lead, second: second, vice: vice, skip: skip, league: league });
                });
            });
        });
    };
    TeamScraper.prototype.ensureTeamIds = function () {
        var _this = this;
        if (this.leagueIds) {
            return Q.resolve(null);
        }
        console.log("Discovering internal team ids...");
        this.leagueIds = {};
        return Q.Promise(function (resolve, reject) {
            request.get(site + "/administrator/index.php?task=teams&option=com_curling", { headers: _this.headers }, function (error, response, body) {
                jsdom.env(body, ["http://code.jquery.com/jquery.min.js"], function (errors, window) {
                    var $ = window.$;
                    var $options = $("select[name=league_id] option");
                    $options.each(function (index, element) {
                        var optionVal = $(element).attr("value");
                        if (optionVal === "0") {
                            return true;
                        }
                        _this.leagueIds[$(element).text()] = parseInt(optionVal, 10);
                    });
                    console.log("Team ids found.");
                    resolve(null);
                });
            });
        });
    };
    return TeamScraper;
}());
//# sourceMappingURL=schedule-scraper.js.map