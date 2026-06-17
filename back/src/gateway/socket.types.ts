import { Server, Socket } from "socket.io";
import { AuthMember } from "../core/decorators/current-member.decorator";
import { WSEvent } from "@42eat-web/shared";
import z from "zod";
import { EventRouter } from "@42eat-web/shared/src/websocket/event-builder";
import { Room, RoomRouter } from "@42eat-web/shared/src/websocket/builder";

interface SocketData {
	user: AuthMember | null;
}

export interface ServerToClientEvents {
	"auth.token_expired": () => void;
	"foyer.status": (data: boolean) => void;
}

export interface ClientToServerEvents {
	join: (rooms: string | string[]) => void;
	leave: (rooms: string | string[]) => void;
}

export type TypedServer = Server<
	ClientToServerEvents,
	Record<string, any>,
	Record<string, never>,
	SocketData
>;

export type TypedSocket = Socket<
	ClientToServerEvents,
	Record<string, any>,
	Record<string, never>,
	SocketData
>;

export type WsHandler<E extends keyof ClientToServerEvents> = (
	client: TypedSocket,
	body: Parameters<ClientToServerEvents[E]>[0],
) => unknown;

export type WsParams<E extends keyof ClientToServerEvents> = Parameters<WsHandler<E>>;


type EmitNode<E extends WSEvent> = {
	emit(payload: z.infer<E["data"]>): void;
};

type BuildEvents<E extends EventRouter> = {
	[K in keyof E]: E[K] extends WSEvent
		? EmitNode<E[K]>
		: E[K] extends EventRouter
			? BuildEvents<E[K]>
			: never;
};

type BuildRoom<R extends Room>
	= R["name"] extends `${string}:${string}`
		? (id: string) => BuildEvents<R["events"]>
		: BuildEvents<R["events"]>;

export type BuildWsServer<T extends RoomRouter> = {
	[K in keyof T]: T[K] extends Room
		? BuildRoom<T[K]>
		: T[K] extends RoomRouter
			? BuildWsServer<T[K]>
			: never;
};
