import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";

@Injectable()
export class ShiftTypeService {
	constructor(private readonly prisma: PrismaService) {}

	public async getTypes() {
		return await this.prisma.shiftType.findMany();
	}

	public async getType(typeId: number) {
		const res = await this.prisma.shiftType.findUnique({ where: { id: typeId } });
		if (!res) throw new NotFoundException("No type found for this id");
		return res;
	}

	public async createType(type: string, xpMult: number | undefined) {
		return await this.prisma.shiftType.create({ data: { type, xpMult } });
	}

	public async editType(
		id: number,
		type: string | undefined,
		xpMult: number | undefined,
	) {
		await this.getType(id);
		return await this.prisma.shiftType.update({
			where: { id },
			data: { type, xpMult },
		});
	}

	public async deleteType(id: number) {
		return await this.prisma.shiftType.delete({ where: { id } });
	}
}
