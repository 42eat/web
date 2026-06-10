import { Injectable } from "@nestjs/common";
import { MembersService } from "../members/members.service";
import { ROOM_DEFINITIONS, RoomPrefix } from "./room-registry";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { AuthMember } from "../core/decorators/current-member.decorator";
import { env } from "../core/env";
import { JwtPayload } from "@42eat-web/shared";

type RoomCheckResult
	= | { allowed: true }
		| { allowed: false; reason: "UNKNOWN_ROOM" | "FORBIDDEN" | "INVALID_ID" | "UNAUTHORIZED" };

type AuthResult
	= | { status: "SUCCESS"; member: AuthMember }
		| { status: "EXPIRED" }
		| { status: "ERROR" };

@Injectable()
export class SocketAuthService {
	constructor(private readonly members: MembersService, private readonly jwtService: JwtService) {}

	public isClientLoggedIn(token: string): AuthResult {
		try {
			const payload = this.jwtService.verify<JwtPayload>(token, { ignoreExpiration: false, secret: env.JWT_SECRET });
			return { status: "SUCCESS", member: { id: payload.sub, emailValidated: payload.emailVerified } };
		} catch (err) {
			if (err instanceof TokenExpiredError) {
				return { status: "EXPIRED" };
			}
			return { status: "ERROR" };
		}
	}

	public async canJoinRoom(room: string, memberId: number | undefined): Promise<RoomCheckResult> {
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

		if (memberId === undefined) {
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
