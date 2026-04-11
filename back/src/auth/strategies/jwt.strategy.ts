import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../jwt.payload";
import { AuthMember } from "../../core/decorators/current-member.decorator";
import { env } from "../../core/env";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: env.JWT_SECRET,
		});
	}

	validate(payload: JwtPayload): AuthMember {
		return { id: payload.sub, emailValidated: payload.emailVerified };
	}
}
