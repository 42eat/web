import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../core/prisma/prisma.service";

@Injectable()
export class SessionsService {
	constructor(private readonly prisma: PrismaService) {}

	private readonly logger = new Logger(SessionsService.name);

	@Cron("05 * * * *")
	async cleanupExpiredSessions() {
		const result = await this.prisma.session.deleteMany({
			where: { expiresAt: { lt: new Date() } },
		});
		this.logger.log(`Deleted ${result.count} expired sessions`);
	}

	public async create(
		memberId: number,
		refreshToken: string,
		expiresAt: Date,
		userAgent: string,
		ipAddress: string,
	) {
		return this.prisma.session.create({
			data: {
				memberId: memberId,
				refreshToken: refreshToken,
				expiresAt: expiresAt,
				userAgent: userAgent,
				ipAddress: ipAddress,
			},
		});
	}

	public async getMemberSessions(memberId: number) {
		return this.prisma.session.findMany({ where: { memberId: memberId } });
	}

	public async removeSession(sessionId: number) {
		return this.prisma.session.delete({ where: { id: sessionId } });
	}
}
