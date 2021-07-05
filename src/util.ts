import { JSONEntity, classToPlain } from "@deepkit/type";

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
