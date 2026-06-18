import { Injectable } from "@nestjs/common";
import { AppGateway } from "../gateway/app.gateway";
import { ws } from "@42eat-web/shared";
import { EventRouter, isEvent } from "@42eat-web/shared";
import { BuildEvents, BuildWsServer, TypedServer } from "../gateway/socket.types";
import { isRoom, RoomRouter } from "@42eat-web/shared";
import z from "zod";
// import { EventName, EventPayload, RoomName } from "@42eat-web/shared";


function buildEvents<T extends EventRouter>(events: T, server: TypedServer, roomName: string): BuildEvents<T> {
	const result: Record<string, unknown> = {};

	for (const key in events) {
		const node = events[key];
		if (isEvent(node)) {
			result[key] = {
				emit(payload: z.infer<typeof node.data>) {
					const eventName = `${roomName}:${node.name}`;
					server.to(roomName).emit(eventName, node.data.parse(payload));
					console.log(`Room: ${roomName} | Event: ${eventName} | data: ${payload}`);
				},
			};
		} else {
			result[key] = buildEvents(node, server, roomName);
		}
	}
	return result as BuildEvents<T>;
}

function buildRoomRouter<T extends RoomRouter>(router: T, server: TypedServer): BuildWsServer<T> {

	const result: Record<string, unknown> = {};

	for (const key in router) {
		const node = router[key];
		if (isRoom(node)) {
			if (node.name.includes(":")) {
				result[key] = (id: string) => {
					const roomName = node.name.replace(/:[^:]+/, id);
					return buildEvents(node.events, server, roomName);
				};
			} else {
				result[key] = buildEvents(node.events, server, node.name);
			}
		} else {
			result[key] = buildRoomRouter(node, server);
		}
	}
	return result as BuildWsServer<T>;
}

export function buildWsServer<T extends RoomRouter>(contract: T, server: TypedServer): BuildWsServer<T> {
	return buildRoomRouter(contract, server);
}

@Injectable()
export class EventService {
	public ws!: BuildWsServer<typeof ws>;

	constructor(private readonly gateway: AppGateway) {}

	onModuleInit() {
		this.ws = buildWsServer(ws, this.gateway.server);
	}

	// public emit<TEvent extends WSEvent>(event: TEvent, payload: z.infer<TEvent["data"]>) {
	// 	this.gateway.server.to("oeoe").emit(event.name, payload);
	// }

	emitFoyerOpenStatus(open: boolean) {
		// this.ws.global.foyer.status.emit(open);
		// this.ws.shifts.byId("123").update.emit();
		this.ws.global.foyer.status.emit(open);
		this.ws.shifts.list.delete.emit({ id: 123 });
		// this.emit(ws.global.events.foyer.status, open);
		// this.emit("global", "foyer.status", open);
	}
}
