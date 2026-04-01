import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { randomBytes } from "crypto";
import { TokenPurpose } from "../generated/prisma/enums";
import { AppUnauthorizedException } from "../core/error/unauthorized";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class TokensService {
	constructor(private readonly prisma: PrismaService) {}

	@Cron("0 * * * *")
	async clearExpiredTokens() {
		await this.prisma.token.deleteMany({
			where: { expiresAt: { lt: new Date() } },
		});
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

	private async createToken(
		memberId: number,
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
		return token;
	}

	public async isValidToken(tokenStr: string, purpose: TokenPurpose) {
		const token = await this.prisma.token.findUnique({
			where: { token: tokenStr },
		});

		if (token) await this.prisma.token.delete({ where: { id: token.id } });

		if (!token || purpose != token.purpose || token.expiresAt < new Date()) {
			throw new AppUnauthorizedException(
				"UNAUTHORIZED",
				"Invalid ou expired token",
			);
		}

		return { memberId: token.memberId, data: token.data };
	}
}
