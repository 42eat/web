import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common";
import { MembersService } from "../members/members.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { SessionsService } from "../sessions/sessions.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly members: MembersService,
		private readonly sessions: SessionsService,
		private readonly jwtService: JwtService,
	) {}

	public async register(
		dto: RegisterDto,
		userAgent: string | undefined,
		ipAddress: string | undefined,
	) {
		const existing = await this.members.getByEmail(dto.email);

		if (existing) {
			throw new ConflictException(["Email alredy used"]);
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const insertedUser = await this.members.create(dto.email, hashedPassword);

		if (!insertedUser) {
			throw new InternalServerErrorException([
				"An error occured while creating the user",
			]);
		}

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

		if (!existing || !existing.password) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const isValidPassword = await bcrypt.compare(
			dto.password,
			existing.password,
		);

		if (!isValidPassword) {
			throw new UnauthorizedException(["Invalid credentials"]);
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
		throw new UnauthorizedException(["Invalid refresh token"]);
	}

	private async generateAccessToken(memberId: number) {
		return this.jwtService.signAsync(
			{ sub: memberId },
			{ secret: process.env.JWT_SECRET, expiresIn: "15m" },
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
			throw new InternalServerErrorException([
				"An error occured while creating the session",
			]);
		}

		return token;
	}
}
