import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AppUnauthorizedException } from "../error/unauthorized";
import { AuthMember } from "../decorators/current-member.decorator";

@Injectable()
export class JwtAuthRefreshGuard extends AuthGuard("jwt-refresh") {
	handleRequest<TUser = AuthMember>(
		err: Error | null,
		user: AuthMember | null,
	) {
		if (err || !user) {
			throw new AppUnauthorizedException(
				"INVALID_REFRESH_TOKEN",
				"Invalid or missing token",
			);
		}
		return user as TUser;
	}
}
