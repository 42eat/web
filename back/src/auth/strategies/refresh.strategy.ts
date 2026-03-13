import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.refresh_token]),
			secretOrKey: process.env.JWT_REFRESH_SECRET ?? "",
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: { sub: number }) {
		const refreshToken = req.cookies?.refresh_token;
		return { id: payload.sub, refreshToken };
	}
}
