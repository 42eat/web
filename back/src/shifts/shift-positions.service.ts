import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";

@Injectable()
export class ShiftPositionService {
	constructor(private readonly prisma: PrismaService) {}

	public async getPositions() {
		return await this.prisma.shiftPosition.findMany();
	}

	public async getPosition(positionId: number) {
		const res = await this.prisma.shiftPosition.findUnique({ where: { id: positionId } });
		if (!res) throw new NotFoundException("No position found for this id");
		return res;
	}

	public async createPosition(position: string, xpMult: number | undefined) {
		return await this.prisma.shiftPosition.create({ data: { position, xpMult } });
	}

	public async editPosition(
		id: number,
		position: string | undefined,
		xpMult: number | undefined,
	) {
		await this.getPosition(id);
		return await this.prisma.shiftPosition.update({
			where: { id },
			data: { position, xpMult },
		});
	}

	public async deletePosition(id: number) {
		return await this.prisma.shiftPosition.delete({ where: { id } });
	}
}
