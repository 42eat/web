import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import type { Response, Request } from "express";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthRefreshGuard } from "./jwt-refresh.guard";
import { type AuthMember, CurrentMember } from "../core/decorators/current-user.decorator";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { AuthResponse } from "./response/auth.response";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	@ApiResponse({ type: AuthResponse })
	@ApiBody({ type: RegisterDto })
	@HttpCode(HttpStatus.OK)
	public async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.register(dto, req.headers["user-agent"], req.ip);

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: false, // todo: passer en true quand on aura le https
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { accessToken };
	}

	@Post("login")
	@ApiResponse({ type: AuthResponse })
	@ApiBody({ type: LoginDto })
	@HttpCode(HttpStatus.OK)
	public async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.login(dto, req.headers["user-agent"], req.ip);

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: false, // todo: passer en true quand on aura le https
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { accessToken };
	}

	@Post("refresh")
	@ApiResponse({ type: AuthResponse })
	@ApiBody({})
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthRefreshGuard)
	public async refresh(@Req() req: Request, @CurrentMember() member: AuthMember, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.refresh(member.id, member.refreshToken ?? "", req.headers["user-agent"], req.ip);

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: false, // todo: passer en true quand on aura le https
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { accessToken };
	}
}
