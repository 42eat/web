import { Injectable } from "@nestjs/common";
import { AppGateway } from "../gateway/app.gateway";

@Injectable()
export class EventsService {
	constructor(private readonly gateway: AppGateway) {}

	emit<T>(room: string, event: string, payload: T) {
		this.gateway.server.to(room).emit(event, payload);
	}

	emitProfileUpdate(userId: number, data: unknown) {
		console.log("emited :", `profile:${userId}`, "profile.updated", data);
		this.emit(`profile:${userId}`, "profile.updated", data);
	}

	emitShiftUpdate(shiftId: string, data: unknown) {
		this.emit(`shift:${shiftId}`, "shift.updated", data);
	}

	emitGlobal(event: string, data: unknown) {
		this.emit("global", event, data);
	}
}
