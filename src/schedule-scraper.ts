import jsdom = require("jsdom");
import request = require("request");
import http = require("http");

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

const site = "http://trianglecurling.com";

request.get(`${site}/administrator`, {}, (error: any, response: http.IncomingMessage, body: any) => {
	console.log("hello");
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
			console.log("Logged in...");

			// Now a GET request to the Location header.
			request.get(response.headers["location"], { headers: stdHeaders }, (error: any, response: http.IncomingMessage, body: any) => {
				// Now a GET request to the schedule page.
			});
		});
	});
});
