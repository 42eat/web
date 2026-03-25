import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AppUnauthorizedException } from "../error/unauthorized";
import { AuthMember } from "../decorators/current-member.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	handleRequest<TUser = AuthMember>(err: any, user: AuthMember | null) {
		if (err || !user) {
			throw new AppUnauthorizedException(
				"INVALID_TOKEN",
				"Invalid or missing token",
			);
		}

		if (!user.emailValidated) {
			throw new AppUnauthorizedException(
				"EMAIL_NOT_VERIFIED",
				"You need to verify your email in order to use the app",
			);
		}

		return user as TUser;
	}
}

@Injectable()
export class JwtAuthGuardWithoutEmailVerif extends AuthGuard("jwt") {
	handleRequest<TUser = AuthMember>(err: any, user: AuthMember | null) {
		if (err || !user) {
			throw new AppUnauthorizedException(
				"INVALID_TOKEN",
				"Invalid or missing token",
			);
		}
		return user as TUser;
	}
}
