import { Injectable } from "@nestjs/common";
import { AppGateway } from "../gateway/app.gateway";
import { ServerToClientEvents } from "../gateway/socket.types";
import { SC } from "@42eat-web/shared";
// import { EventName, EventPayload, RoomName } from "@42eat-web/shared";

@Injectable()
export class EventService {
	constructor(private readonly gateway: AppGateway) {}

	// emit<T>(room: string, event: string, payload: T) {
	// 	this.gateway.server.to(room).emit(event, payload);
	// }

	// emit<
	// 	TRoom extends RoomName,
	// 	TEvent extends EventName<TRoom>,
	// >(
	// 	room: string,
	// 	event: TEvent,
	// 	payload: EventPayload<TRoom, TEvent>,
	// ) {
	// 	this.gateway.server.to(room).emit(event, payload);
	// }

	// room<TName extends SC['rooms']>(
	//   name: TName,
	//   params: ReturnType<SC['params']<TName>>,
	// ) {
	//   const resolved = (name as string).replace(/:(\w+)/g, (_, key) =>
	//     String((params as Record<string, unknown>)?.[key]),
	//   );

	//   return {
	//     emit: <TEvent extends ReturnType<SC['events']<TName>>>(
	//       event: TEvent,
	//       payload: ReturnType<SC['payload']<TName, TEvent>>,
	//     ) => {
	//       this.gateway.server.to(resolved).emit(event as string, payload);
	//     },
	//   };
	// }

	// emit<E extends keyof ServerToClientEvents>(
	// 	room: string,
	// 	event: E,
	// 	...payload: Parameters<ServerToClientEvents[E]>
	// ) {
	// 	this.gateway.server.to(room).emit(event, ...payload);
	// }

	// emitProfileUpdate(userId: number, data: unknown) {
	// 	console.log("emited :", `profile:${userId}`, "profile.updated", data);
	// 	this.emit(`profile:${userId}`, "profile.updated", data);
	// }

	// emitShiftUpdate(shiftId: string, data: unknown) {
	// 	this.emit(`shift:${shiftId}`, "shift.updated", data);
	// }

	emitFoyerOpenStatus(open: boolean) {
		// this.emit("global", "foyer.status", open);
	}
}
