import fs = require("fs");
import Q = require("q");

module qfs {
	export function readFile(filename: string) {
		return Q.Promise<string>((resolve, reject) => {
			fs.readFile(filename, "utf-8", (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}
	export function exists(filename: string) {
		return Q.Promise<boolean>((resolve) => {
			fs.exists(filename, (exists) => {
				resolve(exists);
			});
		})
	}
}
export = qfs;
