import { Permission } from "../core/permissions";


type WSRoom = {
	name: string;
	permissions: Permission[];
	// events: ...
};

type WSRouter = {
	[key: string]: WSRouter | WSRoom;
};

function isRoom(routerChild: WSRouter | WSRoom): routerChild is WSRoom {
	return typeof routerChild.name === "string";
}

type WSRouterOptions<TPrefix extends string = string> = {
	prefix?: TPrefix;
	commonPermissions?: Permission[];
};

type ApplyOptions<T extends WSRoom, O extends WSRouterOptions> = {
	name: O["prefix"] extends string ? `${O["prefix"]}${T["name"]}` : T["name"];
	permission: O["commonPermissions"] extends Permission[] ? [...O["commonPermissions"], ...T["permissions"]] : T["permissions"];
};

type RecursiveWSRouter<T extends WSRouter> = {
	[K in keyof T]: T[K] extends WSRoom ? WSRoom : T[K] extends WSRouter ? RecursiveWSRouter<T[K]> : T[K];
};

type RecursiveApplyWSRouter<T extends WSRouter, O extends WSRouterOptions> = {
	[K in keyof T]: T[K] extends WSRoom ? ApplyOptions<T[K], O> : T[K] extends WSRouter ? RecursiveApplyWSRouter<T[K], O> : T[K];
};

function applyOptions<T extends WSRoom, P extends string, O extends WSRouterOptions<P>>(room: T, options?: O): ApplyOptions<T, O> {
	return {
		name: options?.prefix
			? `${options.prefix}${room.name}`
			: room.name,
	} as ApplyOptions<T, O>;
}

function makeRouter<TWSRouter extends WSRouter, TPrefix extends string, TOptions extends WSRouterOptions<TPrefix>>(router: RecursiveWSRouter<TWSRouter>, options?: TOptions): RecursiveApplyWSRouter<TWSRouter, TOptions> {
	const result = {} as Record<keyof TWSRouter, unknown>;
	for (const k in router) {
		const key = k as keyof typeof router;
		const routerChild = router[key];
		if (isRoom(routerChild)) {
			const appliedOptions = applyOptions(routerChild, options);
			result[key] = appliedOptions;
		} else {
			result[key] = makeRouter(routerChild as RecursiveWSRouter<WSRouter>);
		}
	}
	return result as RecursiveApplyWSRouter<TWSRouter, TOptions>;
}

export const w = {
	router: makeRouter,
};
