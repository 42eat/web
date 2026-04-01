import { Controller, UseGuards, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Response, Request } from "express";
import { JwtAuthRefreshGuard } from "../core/guards/jwt-refresh.guard";
import {
	type AuthMember,
	CurrentMember,
} from "../core/decorators/current-member.decorator";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { authContract } from "@42eat-web/shared";
import {
	JwtAuthGuard,
	JwtAuthGuardWithoutEmailVerif,
} from "../core/guards/jwt-auth.guard";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@TsRestHandler(authContract.register)
	public register(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return tsRestHandler(authContract.register, async ({ body }) => {
			const { accessToken, refreshToken } = await this.authService.register(
				body,
				req.headers["user-agent"],
				req.ip,
			);

			res.cookie("refresh_token", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV == "prod",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			return { status: 200, body: { accessToken } };
		});
	}

	@TsRestHandler(authContract.login)
	public login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return tsRestHandler(authContract.login, async ({ body }) => {
			const { accessToken, refreshToken } = await this.authService.login(
				body,
				req.headers["user-agent"],
				req.ip,
			);

			res.cookie("refresh_token", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV == "prod",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			return { status: 200, body: { accessToken } };
		});
	}

	@TsRestHandler(authContract.refresh)
	@UseGuards(JwtAuthRefreshGuard)
	public refresh(
		@CurrentMember() member: AuthMember,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		return tsRestHandler(authContract.refresh, async () => {
			const { accessToken, refreshToken } = await this.authService.refresh(
				member.id,
				member.refreshToken ?? "",
				req.headers["user-agent"],
				req.ip,
			);

			res.cookie("refresh_token", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV == "prod",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			return { status: 200, body: { accessToken } };
		});
	}

	@TsRestHandler(authContract.confirmEmail)
	public confirmEmail() {
		return tsRestHandler(authContract.confirmEmail, async ({ body }) => {
			await this.authService.confirmEmail(body.token);
			return { status: 204, body: null };
		});
	}

	@TsRestHandler(authContract.askNewConfirmationEmail)
	@UseGuards(JwtAuthGuardWithoutEmailVerif)
	public askNewConfirmationEmail(@CurrentMember() member: AuthMember) {
		return tsRestHandler(authContract.askNewConfirmationEmail, async () => {
			await this.authService.askNewConfirmationEmail(member.id);
			return { status: 204, body: null };
		});
	}

	@TsRestHandler(authContract.changePassword)
	@UseGuards(JwtAuthGuard)
	public changePassword(@CurrentMember() member: AuthMember) {
		return tsRestHandler(authContract.changePassword, async ({ body }) => {
			await this.authService.changePassword(
				member.id,
				body.oldPassword,
				body.newPassword,
			);
			return { status: 204, body: null };
		});
	}

	@TsRestHandler(authContract.requestPasswordReset)
	public requestPasswordReset() {
		return tsRestHandler(
			authContract.requestPasswordReset,
			async ({ body }) => {
				await this.authService.requestPasswordReset(body.email);
				return { status: 204, body: null };
			},
		);
	}

	@TsRestHandler(authContract.resetPassword)
	public resetPassword() {
		return tsRestHandler(authContract.resetPassword, async ({ body }) => {
			await this.authService.resetPassword(body.token, body.newPassword);
			return { status: 204, body: null };
		});
	}
}
