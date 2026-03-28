import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => (req.cookies?.refresh_token as string | null) ?? null,
			]),
			secretOrKey: process.env.JWT_REFRESH_SECRET ?? "",
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: { sub: number }) {
		const refreshToken = req.cookies?.refresh_token as string | undefined;
		return { id: payload.sub, refreshToken };
	}
}
