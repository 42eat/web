import { z } from "zod";
import { Permission } from "../core/permissions";

type SocketEventDef<
	TName extends string,
	TSchema extends z.ZodTypeAny | null,
> = {
	name: TName;
	schema: TSchema;
};

export function defineEvent<
	TName extends string,
	TSchema extends z.ZodTypeAny | null,
>(name: TName, schema: TSchema): SocketEventDef<TName, TSchema> {
	return { name, schema };
}


export type ParamSchema = Record<string, z.ZodTypeAny>;

type RoomDef<
	TName extends string,
	TParams extends ParamSchema | undefined,
	TEvents extends SocketEventDef<string, z.ZodTypeAny | null>[],
> = {
	name: TName;
	params?: TParams;
	permission: Permission | null;
	events: TEvents;
};

export function defineRoom<
	TName extends string,
	TParams extends ParamSchema | undefined,
	TEvents extends SocketEventDef<string, z.ZodTypeAny | null>[],
>(def: {
	name: TName;
	params?: TParams;
	permission: Permission | null;
	events: TEvents;
}): RoomDef<TName, TParams, TEvents> {
	return def;
}

type SocketContract<
	TRooms extends RoomDef<string, ParamSchema | undefined, SocketEventDef<string, z.ZodTypeAny | null>[]>[],
> = {
	rooms: TRooms;
};

export function defineSocketContract<
	TRooms extends RoomDef<string, ParamSchema | undefined, SocketEventDef<string, z.ZodTypeAny | null>[]>[],
>(rooms: TRooms): SocketContract<TRooms> {
	return { rooms };
}
