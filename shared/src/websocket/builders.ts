// import { z } from "zod";
// import { Permission } from "../core/permissions";
// import { fetchApi } from "@ts-rest/core";

// type SocketEventDef<
// 	TName extends string,
// 	TSchema extends z.ZodTypeAny | null,
// > = {
// 	name: TName;
// 	schema: TSchema;
// };

// export function defineEvent<
// 	TName extends string,
// 	TSchema extends z.ZodTypeAny | null,
// >(name: TName, schema: TSchema): SocketEventDef<TName, TSchema> {
// 	return { name, schema };
// }


// export type ParamSchema = Record<string, z.ZodTypeAny>;

// type RoomDef<
// 	TName extends string,
// 	TParams extends ParamSchema | undefined,
// 	TEvents extends SocketEventDef<string, z.ZodTypeAny | null>[],
// > = {
// 	name: TName;
// 	params?: TParams;
// 	permission: Permission | null;
// 	events: TEvents;
// };

// export function defineRoom<
// 	TName extends string,
// 	TParams extends ParamSchema | undefined,
// 	TEvents extends SocketEventDef<string, z.ZodTypeAny | null>[],
// >(def: {
// 	name: TName;
// 	params?: TParams;
// 	permission: Permission | null;
// 	events: TEvents;
// }): RoomDef<TName, TParams, TEvents> {
// 	return def;
// }

// type SocketContract<
// 	TRooms extends RoomDef<string, ParamSchema | undefined, SocketEventDef<string, z.ZodTypeAny | null>[]>[],
// > = {
// 	rooms: TRooms;
// };

// export function defineSocketContract<
// 	TRooms extends RoomDef<string, ParamSchema | undefined, SocketEventDef<string, z.ZodTypeAny | null>[]>[],
// >(rooms: TRooms): SocketContract<TRooms> {
// 	return { rooms };
// }

// type WSEventRouter = {
// 	path: string;
// 	data: z.ZodSchema;
// 	events: {
// 		[key: string]: WSEventRouter;
// 	};
// }

// type WSRecursiveRoomRouter<T extends WSRecursiveRoomRouter> = {
// 	[key: T]: WSRecursiveRoomRouter;
// }

// type WSRoom<TName extends string = "", TPermission extends Permission = Permission> = {
// 	name: TName;
// 	permission: TPermission;

// }

// type WSEventDef<TName extends string, TSchema extends z.ZodTypeAny | null> = {
// 	name: TName;
// 	schema: TSchema;
// };


// type WSRoomRouter

// function defineRecursiveRoomRouter({

// })


import { z } from "zod";
import { ParamSchema, SocketEventDef, SocketRoomDef, SocketContractDef } from "./types";
import { Permission } from "../core/permissions";

function event<TSchema extends z.ZodTypeAny | null>(
	schema: TSchema,
): SocketEventDef<TSchema> {
	return { schema };
}

function room<
	TName extends string,
	TParams extends ParamSchema | undefined,
	TEvents extends Record<string, SocketEventDef<z.ZodTypeAny | null>>,
>(def: {
	name: TName;
	params?: TParams;
	permission: Permission | null;
	events: TEvents;
}): SocketRoomDef<TName, TParams, TEvents> {
	return { _type: "room", ...def };
}

function contract<
	TChildren extends Record<string, SocketRoomDef<any, any, any> | SocketContractDef<any, any>>,
	TBase extends string | undefined = undefined,
>(
	children: TChildren,
	base?: TBase,
): SocketContractDef<TChildren, TBase> {
	return { _type: "contract", base, children };
}

export const w = { event, room, contract } as const;
