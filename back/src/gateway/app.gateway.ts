import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
// import { UseGuards } from "@nestjs/common";
// import { WsJwtGuard } from "../auth/ws-jwt.guard";

@WebSocketGateway({
	namespace: "ws",
	cors: { origin: "*" }, // enlever en prod hein
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage("join")
	handleJoin(
		@MessageBody() rooms: string | string[],
		@ConnectedSocket() client: Socket,
	) {
		const roomList = Array.isArray(rooms)
			? rooms
			: [rooms];
		roomList.forEach((room) => {
			void client.join(room);
		});
		console.log(`Client ${client.id} joined rooms :`, roomList);
		return { status: "ok", rooms: roomList };
	}

	@SubscribeMessage("leave")
	handleLeave(
		@MessageBody() rooms: string | string[],
		@ConnectedSocket() client: Socket,
	) {
		const roomList = Array.isArray(rooms)
			? rooms
			: [rooms];
		roomList.forEach((room) => {
			void client.leave(room);
		});
		console.log(`Client ${client.id} left rooms :`, roomList);
	}
}
