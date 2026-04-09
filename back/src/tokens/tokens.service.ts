import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { randomBytes } from "crypto";
import { TokenPurpose } from "../generated/prisma/enums";
import { AppUnauthorizedException } from "../core/error/unauthorized";
import { Cron } from "@nestjs/schedule";
import { WinstonLoggerService } from "../core/logging/logger.service";
import { LogBuilder } from "../core/logging/log-builder";

export type TokenCreationParam<T extends TokenPurpose>
	= T extends "EMAIL_RESET" ? { memberId: number; data: { newEmail: string } }
		: T extends "STATE_42AUTH" ? null
			: { memberId: number };

@Injectable()
export class TokensService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: WinstonLoggerService,
	) {}

	@Cron("0 * * * *")
	async clearExpiredTokens() {
		const result = await this.prisma.token.deleteMany({
			where: { expiresAt: { lt: new Date() } },
		});
		this.logger.log(LogBuilder.token.cleanupCompleted(result.count));
	}

	public async createConfirmEmailToken(memberId: number) {
		return await this.createToken(memberId, "EMAIL_VERIFICATION");
	}

	public async createResetPasswordToken(memberId: number) {
		return await this.createToken(memberId, "PASSWORD_RESET");
	}

	public async createResetEmailToken(memberId: number, newEmail: string) {
		return await this.createToken(memberId, "EMAIL_RESET", { newEmail });
	}

	public async create42AuthStateToken() {
		return await this.createToken(null, "STATE_42AUTH");
	}

	public async create42LinkStateToken(memberId: number) {
		return await this.createToken(memberId, "STATE_42LINK");
	}

	private async createToken(
		memberId: number | null,
		tokenPurpose: TokenPurpose,
		data: object | undefined = undefined,
	) {
		const token = randomBytes(32).toString("hex");
		await this.prisma.token.create({
			data: {
				token: token,
				purpose: tokenPurpose,
				memberId,
				data,
				expiresAt: new Date(Date.now() + 15 * 60 * 1000),
			},
		});
		this.logger.log(LogBuilder.token.created(tokenPurpose, memberId ?? undefined));
		return token;
	}

	public async isValidToken<T extends TokenPurpose>(
		tokenStr: string,
		purpose: T,
	): Promise<TokenCreationParam<T>> {
		const token = await this.prisma.token.findUnique({
			where: { token: tokenStr },
		});

		if (token) await this.prisma.token.delete({ where: { id: token.id } });

		if (!token || purpose != token.purpose || token.expiresAt < new Date()) {
			this.logger.warn(
				LogBuilder.token.validationFailed(
					purpose,
					!token
						? "Token not found"
						: token.purpose !== purpose
							? "Purpose mismatch"
							: "Token expired",
				),
			);
			throw new AppUnauthorizedException(
				"UNAUTHORIZED",
				"Invalid or expired token",
			);
		}

		this.logger.log(LogBuilder.token.validated(purpose, token.memberId ?? undefined));
		return (
			purpose === "EMAIL_RESET"
				? { memberId: token.memberId, data: token.data }
				: purpose === "STATE_42AUTH"
					? null
					: { memberId: token.memberId }
		) as TokenCreationParam<typeof purpose>;
	}
}
