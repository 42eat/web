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
import { TooManyRequestsException } from "../core/error/to-many-request";
import { Cron } from "@nestjs/schedule";
import { AppForbiddenException } from "../core/error/forbidden";

@Injectable()
export class AuthService {
	constructor(
		private readonly members: MembersService,
		private readonly sessions: SessionsService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailService,
	) {}

	// Cooldown to send a new confirmation email
	private resendCooldowns = new Map<number, Date>();

	@Cron("0 * * * *")
	private cleanupOldCooldowns() {
		const now = Date.now();
		for (const [memberId, date] of this.resendCooldowns.entries()) {
			if (now - date.getTime() > 2 * 60 * 1000) {
				this.resendCooldowns.delete(memberId);
			}
		}
	}

	public async register(
		dto: RegisterDto,
		userAgent: string | undefined,
		ipAddress: string | undefined,
	) {
		const existing = await this.members.getByEmail(dto.email);

		if (existing) {
			throw new ConflictException("Email alredy used");
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const insertedUser = await this.members.create(
			dto.email,
			hashedPassword,
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
		if (!member.email) throw new AppForbiddenException("FORBIDDEN", "you cannot do this");
		if (member.emailValidated) throw new AppForbiddenException("FORBIDDEN", "your email is already validated");

		const lastSent = this.resendCooldowns.get(member.id);
		if (lastSent && Date.now() - lastSent.getTime() < 60_000) {
			throw new TooManyRequestsException(
				"Please wait before requesting a new email",
			);
		}

		await this.mailService.sendEmail([member.email], "Confirm your email - 42's Foyer", "confirm-email", {
			username: member.displayName,
			token: await this.jwtService.signAsync(
				{ sub: member.id },
				{ secret: process.env.JWT_EMAIL_SECRET, expiresIn: "15m" },
			),
			baseUrl: process.env.BASE_URL,
			baseFrontUrl: process.env.BASE_FRONT_URL,
			year: new Date().getFullYear(),
		});

		this.resendCooldowns.set(member.id, new Date());
	}

	public async confirmEmail(token: string) {
		try {
			const payload = await this.jwtService.verifyAsync<{ sub: number }>(
				token,
				{ secret: process.env.JWT_EMAIL_SECRET },
			);

			await this.members.verifyEmail(payload.sub);
		} catch {
			throw new AppUnauthorizedException(
				"INVALID_TOKEN",
				"Invalid or expired token",
			);
		}
	}

	public async askNewConfirmationEmail(memberId: number) {
		const member = await this.members.getById(memberId);
		await this.sendEmailValidation(member);
	}
}
