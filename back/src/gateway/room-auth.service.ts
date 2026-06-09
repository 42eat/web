import { Injectable } from "@nestjs/common";
import { MembersService } from "../members/members.service";
import { ROOM_DEFINITIONS, RoomPrefix } from "./room-registry";

type RoomCheckResult
	= | { allowed: true }
		| { allowed: false; reason: "UNKNOWN_ROOM" | "FORBIDDEN" | "INVALID_ID" | "UNAUTHORIZED" };

@Injectable()
export class RoomAuthService {
	constructor(private readonly members: MembersService) {}

	async canJoinRoom(room: string, memberId: number | null): Promise<RoomCheckResult> {
		const { prefix, id } = this.parseRoom(room);
		const definition = ROOM_DEFINITIONS[prefix as RoomPrefix];

		if (!definition) {
			return { allowed: false, reason: "UNKNOWN_ROOM" };
		}

		if (id !== null && "validateId" in definition && !definition.validateId(id)) {
			return { allowed: false, reason: "INVALID_ID" };
		}

		if (definition.permission === null) {
			return { allowed: true };
		}

		if (memberId === null) {
			return { allowed: false, reason: "UNAUTHORIZED" };
		}

		const hasPerm = await this.members.doMemberHavePermission(
			memberId,
			definition.permission,
		);

		return hasPerm
			? { allowed: true }
			: { allowed: false, reason: "FORBIDDEN" };
	}

	private parseRoom(room: string): { prefix: string; id: string | null } {
		if (room in ROOM_DEFINITIONS) {
			return { prefix: room, id: null };
		}

		const lastColon = room.lastIndexOf(":");
		if (lastColon === -1) return { prefix: room, id: null };

		return {
			prefix: room.slice(0, lastColon),
			id: room.slice(lastColon + 1),
		};
	}
}
