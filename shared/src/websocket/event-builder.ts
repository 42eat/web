import z from "zod";

export type WSEvent = {
	name: string;
	data: z.ZodTypeAny;
};

export type EventRouter = {
	[key: string]: EventRouter | WSEvent;
};

export function isEvent(eventRouterChild: EventRouter | WSEvent): eventRouterChild is WSEvent {
	return typeof eventRouterChild.name === "string";
}

export type EventRouterOptions<TPrefix extends string = string> = {
	prefix?: TPrefix;
};

export type ApplyEventOptions<T extends WSEvent, O extends EventRouterOptions> = {
	name: O["prefix"] extends string ? `${O["prefix"]}:${T["name"]}` : T["name"];
	data: T["data"];
};

export type RecursiveEventRouter<T extends EventRouter> = {
	[K in keyof T]: T[K] extends WSEvent ? T[K] : T[K] extends EventRouter ? RecursiveEventRouter<T[K]> : T[K];
};

export type RecursiveApplyEventRouter<T extends EventRouter, O extends EventRouterOptions = object> = {
	[K in keyof T]: T[K] extends WSEvent ? ApplyEventOptions<T[K], O> : T[K] extends EventRouter ? RecursiveApplyEventRouter<T[K], O> : T[K];
};

function applyEventOptions<T extends WSEvent, P extends string, O extends EventRouterOptions<P>>(event: T, options?: O): ApplyEventOptions<T, O> {
	return {
		name: options?.prefix
			? `${options.prefix}:${event.name}`
			: event.name,
		data: event.data,
	} as ApplyEventOptions<T, O>;
}

export function makeEventRouter<T extends EventRouter, TPrefix extends string, O extends EventRouterOptions<TPrefix>>(router: RecursiveEventRouter<T>, options?: O): RecursiveApplyEventRouter<T, O> {
	const result = {} as Record<keyof T, unknown>;
	for (const k in router) {
		const key = k as keyof typeof router;
		const routerChild = router[key];
		if (isEvent(routerChild)) {
			const appliedOptions = applyEventOptions(routerChild, options);
			result[key] = appliedOptions;
		} else {
			result[key] = makeEventRouter(routerChild as RecursiveEventRouter<EventRouter>, options);
		}
	}
	return result as RecursiveApplyEventRouter<T, O>;
}


