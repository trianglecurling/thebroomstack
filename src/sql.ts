import koa = require("koa");
import Q = require("q");
import qfs = require("./qfs");

var mssql = require("mssql");

export interface SqlConnectionInfo {
	user: string;
	password: string;
	database: string;
	host: string;
}

/**
 * Augment the koa Request to include the sqlConnection.
 */
declare module "koa" {
	interface Context {
		sqlConnection: any;
	}
}

function buildConnectionString(connInfo: SqlConnectionInfo) {
	return `mssql://${connInfo.user}:${connInfo.password}@${connInfo.host}/${connInfo.database}`;
}

export function connectSql(connectionInfo: SqlConnectionInfo) {
	return async (ctx: koa.Context, next: Function) => {
		ctx.sqlConnection = await mssql.connect(buildConnectionString(connectionInfo));
		await next();
	};
}
