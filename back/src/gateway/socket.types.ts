import { Server, Socket } from "socket.io";
import { AuthMember } from "../core/decorators/current-member.decorator";

interface SocketData {
	user: AuthMember | null;
}

export interface ServerToClientEvents {
	"auth:token_expired": () => void;
	"foyer:open": (data: boolean) => void;
}

export interface ClientToServerEvents {
	join: (rooms: string | string[]) => void;
	leave: (rooms: string | string[]) => void;
}

export type TypedServer = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	Record<string, never>,
	SocketData
>;

export type TypedSocket = Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	Record<string, never>,
	SocketData
>;

export type WsHandler<E extends keyof ClientToServerEvents> = (
	body: Parameters<ClientToServerEvents[E]>[0],
	client: TypedSocket,
) => unknown;

export type WsParams<E extends keyof ClientToServerEvents> = Parameters<WsHandler<E>>;
