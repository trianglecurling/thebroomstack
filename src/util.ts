import { JSONEntity, classToPlain } from "@deepkit/type";

export function autoSerialize<T>(target: T | T[]): typeof target extends any[] ? JSONEntity<T>[] : JSONEntity<T> {
	if (Array.isArray(target)) {
		return target.map((e) => classToPlain((e as any).constructor, e)) as any;
	} else {
		return classToPlain((target as any).constructor, target) as any;
	}
}

// Http status code mappings
export const httpStatusCodes = {
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Request Entity Too Large",
	414: "Request-URI Too Long",
	415: "Unsupported Media Type",
	416: "Requested Range Not Satisfiable",
	417: "Expectation Failed",
	418: "I'm a teapot",
	422: "Unprocessable Entity",
	423: "Locked",
	424: "Failed Dependency",
	425: "Unordered Collection",
	426: "Upgrade Required",
	428: "Precondition Required",
	429: "Too Many Requests",
	431: "Request Header Fields Too Large",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates",
	507: "Insufficient Storage",
	508: "Loop Detected",
	510: "Not Extended",
	511: "Network Authentication Required",
};

// declare global {
// 	namespace NodeJS {
// 		interface Global {
// 			HttpError: typeof HttpError;
// 		}
// 	}
// }

class _HttpError extends Error {
	constructor(public status: keyof typeof httpStatusCodes, public message: string) {
		super(`${status}: ${httpStatusCodes[status]}\nmessage`);
		if (!(status in httpStatusCodes)) {
			throw new _HttpError(500, "Unknown HTTP error status code: " + status);
		}
	}
}

declare global {
	const HttpError: typeof _HttpError;
	namespace NodeJS {
		interface Global {
			HttpError: typeof _HttpError;
		}
	}
}
global.HttpError = _HttpError;
