import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { MembersService } from "../members/members.service";
import { RegisterDto } from "@42eat-web/shared";
import * as bcrypt from "bcrypt";
import { LoginDto } from "@42eat-web/shared";
import { JwtService } from "@nestjs/jwt";
import { SessionsService } from "../sessions/sessions.service";
import { createJwtPayload } from "./jwt.payload";
import { AppUnauthorizedException } from "../core/error/unauthorized";
import { MailService } from "../core/mail/mail.service";
import { Member } from "../generated/prisma/client";
import { AppForbiddenException } from "../core/error/forbidden";
import { TokensService } from "../tokens/tokens.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly members: MembersService,
		private readonly sessions: SessionsService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailService,
		private readonly tokensService: TokensService,
	) {}

	// This will be replaced by nodejs throttler
	// // Cooldown to send a new confirmation email
	// private resendCooldowns = new Map<number, Date>();

	// @Cron("0 * * * *")
	// private cleanupOldCooldowns() {
	// 	const now = Date.now();
	// 	for (const [memberId, date] of this.resendCooldowns.entries()) {
	// 		if (now - date.getTime() > 2 * 60 * 1000) {
	// 			this.resendCooldowns.delete(memberId);
	// 		}
	// 	}
	// }

	public async register(
		dto: RegisterDto,
		userAgent: string | undefined,
		ipAddress: string | undefined,
	) {
		const existing = await this.members.getByEmail(dto.email);

		if (existing) {
			throw new ConflictException("Email alredy used");
		}

		const insertedUser = await this.members.create(
			dto.email,
			dto.password,
			dto.displayName,
		);

		if (!insertedUser) {
			throw new InternalServerErrorException(
				"An error occured while creating the user",
			);
		}

		await this.sendEmailValidation(insertedUser);

		return {
			accessToken: await this.generateAccessToken(insertedUser.id),
			refreshToken: await this.generateRefreshToken(
				insertedUser.id,
				userAgent,
				ipAddress,
			),
		};
	}

	public async login(
		dto: LoginDto,
		userAgent: string | undefined,
		ipAddress: string | undefined,
	) {
		const existing = await this.members.getByEmail(dto.email);

		if (!existing) {
			throw new AppUnauthorizedException(
				"INVALID_CREDENTIALS",
				"Invalid credentials",
			);
		}

		if (!existing.password) {
			throw new AppUnauthorizedException(
				"INTRA_ONLY_ACCOUNT",
				"This email is related to an intra login only",
			);
		}

		const isValidPassword = await bcrypt.compare(
			dto.password,
			existing.password,
		);

		if (!isValidPassword) {
			throw new AppUnauthorizedException(
				"INVALID_CREDENTIALS",
				"Invalid credentials",
			);
		}

		return {
			accessToken: await this.generateAccessToken(existing.id),
			refreshToken: await this.generateRefreshToken(
				existing.id,
				userAgent,
				ipAddress,
			),
		};
	}

	public async refresh(
		memberId: number,
		refreshToken: string,
		userAgent: string | undefined,
		ipAddress: string | undefined,
	) {
		let allSessions = await this.sessions.getMemberSessions(memberId);
		allSessions = allSessions.filter(
			(session) => session.expiresAt > new Date(),
		);

		for (const session of allSessions) {
			const isValidSession = await bcrypt.compare(
				refreshToken,
				session.refreshToken,
			);
			if (isValidSession) {
				await this.sessions.removeSession(session.id);

				return {
					accessToken: await this.generateAccessToken(memberId),
					refreshToken: await this.generateRefreshToken(
						memberId,
						userAgent,
						ipAddress,
					),
				};
			}
		}
		throw new AppUnauthorizedException(
			"INVALID_REFRESH_TOKEN",
			"Invalid refresh token",
		);
	}

	private async generateAccessToken(memberId: number) {
		const user = await this.members.getById(memberId);
		return this.jwtService.signAsync(
			createJwtPayload(memberId, user.emailValidated),
			{
				secret: process.env.JWT_SECRET,
				expiresIn: "15m",
			},
		);
	}

	private async generateRefreshToken(
		memberId: number,
		userAgent: string | undefined,
		ipAddress: string | undefined,
	) {
		const token = await this.jwtService.signAsync(
			{ sub: memberId },
			{ secret: process.env.JWT_REFRESH_SECRET, expiresIn: "7d" },
		);
		const hashedToken = await bcrypt.hash(token, 10);
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		if (
			!(await this.sessions.create(
				memberId,
				hashedToken,
				expiresAt,
				userAgent ?? "",
				ipAddress ?? "unknown",
			))
		) {
			throw new InternalServerErrorException(
				"An error occured while creating the session",
			);
		}

		return token;
	}

	private async sendEmailValidation(member: Member) {
		if (member.emailValidated)
			throw new AppForbiddenException(
				"FORBIDDEN",
				"your email is already validated",
			);

		await this.mailService.sendEmail(
			[member.email],
			"Confirm your email - 42's Foyer",
			"confirm-email",
			{
				username: member.displayName,
				token: await this.tokensService.createConfirmEmailToken(member.id),
				baseFrontUrl: process.env.BASE_FRONT_URL,
				year: new Date().getFullYear(),
			},
		);
	}

	public async confirmEmail(token: string) {
		const payload = await this.tokensService.isValidToken(
			token,
			"EMAIL_VERIFICATION",
		);

		await this.members.verifyEmail(payload.memberId);
	}

	public async askNewConfirmationEmail(memberId: number) {
		const member = await this.members.getById(memberId);
		await this.sendEmailValidation(member);
	}

	private async sendResetPasswordEmail(member: Member) {
		await this.mailService.sendEmail(
			[member.email],
			"Reset your password - 42's Foyer",
			"reset-password",
			{
				token: await this.tokensService.createResetPasswordToken(member.id),
				baseFrontUrl: process.env.BASE_FRONT_URL,
				year: new Date().getFullYear(),
			},
		);
	}

	public async requestPasswordReset(email: string) {
		const member = await this.members.getByEmail(email);

		// Pas d'erreur pour eviter que quelqu'un puisse sonder les email en db
		if (member) {
			await this.sendResetPasswordEmail(member);
		}
	}

	public async resetPassword(token: string, password: string) {
		const payload = await this.tokensService.isValidToken(
			token,
			"PASSWORD_RESET",
		);

		await this.members.setPassword(payload.memberId, password);
	}

	public async changePassword(
		memberId: number,
		oldPassword: string,
		newPassword: string,
	) {
		const existing = await this.members.getById(memberId);
		if (!existing) {
			throw new AppForbiddenException(
				"FORBIDDEN",
				"You shouln't have an error unless your account have been deleted or something like that",
			);
		}

		if (!existing.password) {
			throw new AppForbiddenException(
				"FORBIDDEN",
				"You shouln't be able to call this route with an intra only account",
			);
		}

		if (!(await bcrypt.compare(oldPassword, existing.password))) {
			// Seule erreur a gerer coté front car les autres ne devraient pas pouvoir arriver
			throw new AppForbiddenException("FORBIDDEN", "Invalid password");
		}

		await this.members.setPassword(memberId, newPassword);
	}

	public async logout(memberId: number, refreshToken: string | undefined) {
		const allSessions = await this.sessions.getMemberSessions(memberId);

		if (!refreshToken) return;

		for (const session of allSessions) {
			if (await bcrypt.compare(refreshToken, session.refreshToken)) {
				await this.sessions.removeSession(session.id);
			}
		}
	}

	private async sendChangeEmail(member: Member, newEmail: string) {
		await this.mailService.sendEmail(
			[member.email],
			"Change your email - 42's Foyer",
			"reset-email",
			{
				token: await this.tokensService.createResetEmailToken(
					member.id,
					newEmail,
				),
				baseFrontUrl: process.env.BASE_FRONT_URL,
				year: new Date().getFullYear(),
			},
		);
	}

	public async requestEmailReset(
		memberId: number,
		password: string,
		newEmail: string,
	) {
		const member = await this.members.getById(memberId);

		if (!member) {
			throw new AppForbiddenException("FORBIDDEN", "This shouldn't append");
		}

		if (
			!member.password ||
			!(await bcrypt.compare(password, member.password))
		) {
			throw new AppForbiddenException("FORBIDDEN", "Invalid password");
		}

		await this.sendChangeEmail(member, newEmail);
	}

	public async resetEmail(token: string) {
		const payload = await this.tokensService.isValidToken(token, "EMAIL_RESET");
		await this.members.setEmail(payload.memberId, payload.data.newEmail);
	}
}
