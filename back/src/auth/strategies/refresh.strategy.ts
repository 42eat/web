import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "../../core/env";
import { UUID } from "crypto";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => (req.cookies?.refresh_token as string | null) ?? null,
			]),
			secretOrKey: env.JWT_REFRESH_SECRET,
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: { sub: number; jti: UUID }) {
		return { id: payload.sub, jti: payload.jti };
	}
}
