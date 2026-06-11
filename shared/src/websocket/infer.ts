import { z } from "zod";
import { ParamSchema, SocketEventDef, SocketRoomDef, SocketContractDef } from "./types";

type Prefix<TBase extends string | undefined, TName extends string>
	= TBase extends string ? `${TBase}.${TName}` : TName;

type ResolveRoomNames<
	TNode extends SocketRoomDef<any, any, any> | SocketContractDef<any, any>,
	TPrefix extends string | undefined,
>
	= TNode extends SocketRoomDef<infer TName, any, any>
		? Prefix<TPrefix, TName>
		: TNode extends SocketContractDef<infer TChildren, infer TBase>
			? {
				[K in keyof TChildren]: ResolveRoomNames<
					TChildren[K],
					TBase extends string
						? TPrefix extends string ? `${TPrefix}.${TBase}` : TBase
						: TPrefix
				>
			}[keyof TChildren]
			: never;

export type RoomNames<TContract extends SocketContractDef<any, any>>
	= ResolveRoomNames<TContract, undefined>;

type RoomByName<
	TContract extends SocketContractDef<any, any>,
	TName extends string,
	TPrefix extends string | undefined = undefined,
>
	= {
		[K in keyof TContract["children"]]:
		TContract["children"][K] extends SocketRoomDef<infer RName, infer RParams, infer REvents>
			? Prefix<TPrefix, RName> extends TName
				? SocketRoomDef<RName, RParams, REvents>
				: never
			: TContract["children"][K] extends SocketContractDef<any, infer CBase>
				? RoomByName<
					TContract["children"][K],
					TName,
					CBase extends string
						? TPrefix extends string ? `${TPrefix}.${CBase}` : CBase
						: TPrefix
				>
				: never
	}[keyof TContract["children"]];

export type RoomParams<
	TContract extends SocketContractDef<any, any>,
	TName extends RoomNames<TContract>,
>
	= RoomByName<TContract, TName> extends SocketRoomDef<any, infer TParams, any>
		? TParams extends ParamSchema
			? { [K in keyof TParams]: z.infer<TParams[K]> }
			: undefined
		: never;

export type EventNames<
	TContract extends SocketContractDef<any, any>,
	TRoomName extends RoomNames<TContract>,
>
	= RoomByName<TContract, TRoomName> extends SocketRoomDef<any, any, infer TEvents>
		? `${TRoomName}.${string & keyof TEvents}`
		: never;

export type EventPayload<
	TContract extends SocketContractDef<any, any>,
	TRoomName extends RoomNames<TContract>,
	TEventName extends EventNames<TContract, TRoomName>,
>
	= RoomByName<TContract, TRoomName> extends SocketRoomDef<any, any, infer TEvents>
		? TEventName extends `${TRoomName}.${infer TKey}`
			? TKey extends keyof TEvents
				? TEvents[TKey] extends SocketEventDef<infer TSchema>
					? TSchema extends z.ZodTypeAny
						? z.infer<TSchema>
						: null
					: never
				: never
			: never
		: never;

export type SocketClient<TContract extends SocketContractDef<any, any>> = {
	rooms: RoomNames<TContract>;
	params: <TName extends RoomNames<TContract>>(name: TName) => RoomParams<TContract, TName>;
	events: <TName extends RoomNames<TContract>>(room: TName) => EventNames<TContract, TName>;
	payload: <
		TRoom extends RoomNames<TContract>,
		TEvent extends EventNames<TContract, TRoom>,
	>(room: TRoom, event: TEvent) => EventPayload<TContract, TRoom, TEvent>;
};
