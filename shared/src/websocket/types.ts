import { z } from "zod";
import { Permission } from "../core/permissions";

export type ParamSchema = Record<string, z.ZodTypeAny>;

export type SocketEventDef<TSchema extends z.ZodTypeAny | null> = {
	schema: TSchema;
};

export type SocketRoomDef<
	TName extends string,
	TParams extends ParamSchema | undefined,
	TEvents extends Record<string, SocketEventDef<z.ZodTypeAny | null>>,
> = {
	_type: "room";
	name: TName;
	params?: TParams;
	permission: Permission | null;
	events: TEvents;
};

export type SocketContractDef<
	TChildren extends Record<string, SocketRoomDef<any, any, any> | SocketContractDef<any, any>>,
	TBase extends string | undefined,
> = {
	_type: "contract";
	base?: TBase;
	children: TChildren;
};
