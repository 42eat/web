import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";

@Injectable()
export class ShiftsService {
	constructor(private readonly prisma: PrismaService) {}

	public async getShifts() {
		const shifts = await this.prisma.shift.findMany();
		console.log(shifts);
		return shifts;
	}


	public async createShift() {
		const shifts = await this.prisma.shift.findMany();
		console.log(shifts);
		return shifts;
	}
}
