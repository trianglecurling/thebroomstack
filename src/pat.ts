import crypto = require("crypto");
import jwt = require("jsonwebtoken");
import service = require("./service");

export class PatService extends service.Service {
	public async savePat(token: void) {
		const tokenStr = JSON.stringify(token);
		const hash = crypto.createHash("sha256");
		hash.update(tokenStr);
		const hashStr = hash.digest("base64");
		const sqlRequest = this.ctx.sqlConnection.request();
		await sqlRequest
			.input("pat", hashStr)
			.input("jwt", tokenStr)
			.execute("prc_AddAccessToken");

		return hashStr;
	}
}
