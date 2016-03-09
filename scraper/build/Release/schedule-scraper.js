"use strict";
var jsdom = require("jsdom");
var request = require("request");
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
                        var $rows = $table.find("tbody tr");
                        $rows.each(function (index, row) {
                            var $row = $(row);
                            var $timeCell = $row.find("td").eq(0);
                            var timeColSpan = $timeCell.attr("colspan");
                            if (timeColSpan && timeColSpan > 1) {
                                return true;
                            }
                            var time = $timeCell.text();
                            var _a = timeRE.exec(time), fullTime = _a[0], hour = _a[1], minute = _a[2], meridian = _a[3];
                            var curDate = new Date();
                            var dateTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), parseInt(hour, 10), parseInt(minute, 10));
                            var sheet = $row.find("td").eq(1).text().trim();
                            if (["A", "B", "C", "D"].indexOf(sheet) === -1) {
                                return true;
                            }
                            var teams = $row.find("td").eq(2).text().trim();
                            var _b = teams.split("vs").map(function (t) { return t.trim(); }), team1 = _b[0], team2 = _b[1];
                            todaysGames.push({
                                time: dateTime,
                                sheet: sheet,
                                team1: team1,
                                team2: team2
                            });
                        });
                        console.log("Today's games: ");
                        console.log(JSON.stringify(todaysGames, null, 4));
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=schedule-scraper.js.map