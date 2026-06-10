import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { SocketAuthService } from "./socket-auth.service";
import { TypedServer, TypedSocket, WsParams } from "./socket.types";

@WebSocketGateway({
	path: "/ws",
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly socketAuthService: SocketAuthService) {}

	@WebSocketServer()
	server: TypedServer;

	public handleConnection(client: TypedSocket) {
		client.data = { user: null };
		const token = client.handshake.auth?.token as string | undefined;
		if (!token) {
			console.log(`Anonymous client connected: ${client.id}`);
			return;
		}

		const payload = this.socketAuthService.isClientLoggedIn(token);

		if (payload.status == "SUCCESS") {
			client.data.user = payload.member;
			console.log(`Logged client connected: ${client.id} | userid: ${payload.member?.id}`);
			return;
		} else if (payload.status == "ERROR") {
			console.log(`Anonymous client connected: ${client.id}`);
			return;
		} else if (payload.status == "EXPIRED") {
			client.emit("auth.token_expired");
			console.log(`Anonymous client connected: ${client.id}, token refresh requested`);
			return;
		}
	}

	public handleDisconnect(client: TypedSocket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage("join")
	public async handleJoin(...[client, rooms]: WsParams<"leave">) {
		const roomList = Array.isArray(rooms)
			? rooms
			: [rooms];
		for (const room of roomList) {
			console.log(client.data.user);
			const canJoinRoom = await this.socketAuthService.canJoinRoom(room, client.data.user?.id);
			if (canJoinRoom.allowed) {
				console.log(`Client ${client.id} joined room :`, room);
				void client.join(room);
			}
		}
		return { status: "ok", rooms: roomList };
	}

	@SubscribeMessage("leave")
	public handleLeave(...[client, rooms]: WsParams<"leave">) {
		const roomList = Array.isArray(rooms)
			? rooms
			: [rooms];
		roomList.forEach((room) => {
			void client.leave(room);
		});
		console.log(`Client ${client.id} left rooms :`, roomList);
	}
}
