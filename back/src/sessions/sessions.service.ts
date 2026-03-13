import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SessionsService {
	constructor(private readonly prisma: PrismaService) {}

	public async create(memberId: number, refreshToken: string, expiresAt: Date, userAgent: string, ipAddress: string) {
		return this.prisma.session.create({ data: { member_id: memberId, refresh_token: refreshToken, expires_at: expiresAt, user_agent: userAgent, ip_address: ipAddress } });
	}

	public async getMemberSessions(memberId: number) {
		return this.prisma.session.findMany({ where: { member_id: memberId } });
	}

	public async removeSession(sessionId: number) {
		return this.prisma.session.delete({ where: { id: sessionId } });
	}

}
