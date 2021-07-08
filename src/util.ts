import { JSONEntity, classToPlain } from "@deepkit/type";
import { FastifyReply } from "fastify";

export function autoSerialize<T>(
	target: T | T[]
): typeof target extends any[] ? JSONEntity<T>[] : JSONEntity<T> {
	if (Array.isArray(target)) {
		return target.map((e) =>
			classToPlain((e as any).constructor, e)
		) as any;
	} else {
		return classToPlain((target as any).constructor, target) as any;
	}
}

export function errorHandler(e: unknown, reply: FastifyReply): never {
	if (e instanceof Error) {
		if (/^\d\d\d:/.test(e.message)) {
			const [code, error] = e.message.split(":", 2);
			reply.status(Number(code));
			throw new Error(error);
		} else {
			throw e;
		}
	} else {
		reply.status(500);
		throw e;
	}
}
