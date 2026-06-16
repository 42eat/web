import { AppRouteQuery, AppRouter, isAppRoute, isAppRouteQuery } from "@ts-rest/core";

type QueryKey<T extends string[]> = <const S extends string[] = []>(suffix?: S) => S extends undefined ? T : [...T, ...S];

type QueryKeyRouter<T extends AppRouter, P extends string[] = []> = {
	[K in keyof T & string as T[K] extends AppRouter ? K : T[K] extends AppRouteQuery ? K : never]: T[K] extends AppRouter ? QueryKeyRouter<T[K], [...P, K]> : T[K] extends AppRouteQuery ? QueryKey<[...P, K]> : never;
};

export function queryKeyFromContract<T extends AppRouter>(obj: T, prefix: string[] = []): QueryKeyRouter<T> {
	const result = {} as Record<string, unknown>;
	for (const k in obj) {
		if (isAppRoute(obj[k])) {
			if (isAppRouteQuery(obj[k])) result[k] = (suffix: string[] = []) => [...prefix, k, ...suffix];
		} else {
			result[k] = queryKeyFromContract(obj[k], [...prefix, k]);
		}
	}
	return result as QueryKeyRouter<T>;
}
