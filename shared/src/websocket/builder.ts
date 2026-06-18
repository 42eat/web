import { Permission } from "../core/permissions";
import { EventRouter, makeEventRouter, RecursiveApplyEventRouter } from "./event-builder";

export type ExtractParamsName<T extends string = string> = T extends `:${infer TParam}`
	? TParam extends `${infer TParamName}:${infer TSuffix}`
		? TParamName | ExtractParamsName<TSuffix>
		: TParam
	: T extends `${string}:${infer TSuffix}`
		? ExtractParamsName<TSuffix>
		: never;

export type Room<N extends string = string, E extends EventRouter = EventRouter> = {
	name: N;
	params: ExtractParamsName<N>;
	permissions: Permission[];
	events: E;
};

export type RoomRouter = {
	[key: string]: RoomRouter | Room;
};

export function isRoom(routerChild: RoomRouter | Room): routerChild is Room {
	return typeof routerChild.name === "string";
}

export type RouterOptions<TPrefix extends string = string> = {
	prefix?: TPrefix;
	commonPermissions?: Permission[];
};

export type ApplyOptions<T extends Room, O extends RouterOptions> = {
	name: O["prefix"] extends string ? `${O["prefix"]}:${T["name"]}` : T["name"];
	permissions: O["commonPermissions"] extends Permission[] ? [...O["commonPermissions"], ...T["permissions"]] : T["permissions"];
	events: RecursiveApplyEventRouter<T["events"]>;
};

export type RecursiveRouter<T extends RoomRouter> = {
	[K in keyof T]: T[K] extends Room ? T[K] : T[K] extends RoomRouter ? RecursiveRouter<T[K]> : T[K];
};

export type RecursiveApplyRouter<T extends RoomRouter, O extends RouterOptions> = {
	[K in keyof T]: T[K] extends Room ? ApplyOptions<T[K], O> : T[K] extends RoomRouter ? RecursiveApplyRouter<T[K], O> : T[K];
};

function applyOptions<T extends Room, P extends string, O extends RouterOptions<P>>(room: T, options?: O): ApplyOptions<T, O> {
	return {
		name: options?.prefix
			? `${options.prefix}:${room.name}`
			: room.name,
		permissions: options?.commonPermissions
			? [...options.commonPermissions, ...room.permissions]
			: room.permissions,
		events: makeEventRouter(room.events),
	} as ApplyOptions<T, O>;
}

function makeRoomRouter<const T extends RoomRouter, TPrefix extends string, O extends RouterOptions<TPrefix>>(router: RecursiveRouter<T>, options?: O): RecursiveApplyRouter<T, O> {
	const result = {} as Record<keyof T, unknown>;
	for (const k in router) {
		const key = k as keyof typeof router;
		const routerChild = router[key];
		if (isRoom(routerChild)) {
			const appliedOptions = applyOptions(routerChild, options);
			result[key] = appliedOptions;
		} else {
			result[key] = makeRoomRouter(routerChild as RecursiveRouter<RoomRouter>, options);
		}
	}
	return result as RecursiveApplyRouter<T, O>;
}

export const w = {
	router: makeRoomRouter,
	eventRouter: makeEventRouter,
};
