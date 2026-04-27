import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { CreateShiftDto, PERMISSIONS } from "@42eat-web/shared";
import { Prisma } from "../generated/prisma/client";
import { EditShiftDto } from "@42eat-web/shared/src/contracts/shifts/schemas/shifts.schema";
import { MembersService } from "../members/members.service";

@Injectable()
export class ShiftsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly members: MembersService,
	) {}

	public async getShifts() {
		const shifts = await this.prisma.shift.findMany({
			include: {
				shiftMembers: {
					include: {
						member: {},
						position: {},
					},
				},
				type: {},
				manager: {},
			},
		});
		return shifts.map(
			({ shiftMembers, ...rest }) => ({ ...rest, members: shiftMembers }),
		);
	}

	public async getShift(id: number) {
		const shift = await this.prisma.shift.findUnique({
			where: { id },
			include: {
				shiftMembers: {
					include: {
						member: {},
						position: {},
					},
				},
				type: {},
				manager: {},
			},
		});
		if (!shift) throw new NotFoundException("Shift does not exist");
		const { shiftMembers, ...rest } = shift;
		return { ...rest, members: shiftMembers };
	}

	public async createShift(data: CreateShiftDto, reporterId: number) {
		const date = new Date(data.date);

		const existing = await this.prisma.shift.findUnique({
			where: { date_typeId: { date, typeId: data.type } },
		});

		if (existing) throw new ConflictException("A shift of this type already exist for this date");

		try {
			const shift = await this.prisma.$transaction(async (tx) => {
				const insertedShift = await tx.shift.create({
					data: {
						date,
						managerId: data.manager,
						typeId: data.type,
						reporterId,
					},
				});

				await tx.shiftMember.createMany({
					data: data.members.map(
						(m) => ({ shiftId: insertedShift.id, memberId: m.member, positionId: m.position }),
					),
				});

				return insertedShift;
			});

			return this.getShift(shift.id);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
				throw new NotFoundException("Invalid member, manager or shift position id");
			}
			throw new InternalServerErrorException("An error occured while creating the shift");
		}
	}

	public async editShift(shiftId: number, data: EditShiftDto, memberId: number) {
		const existing = await this.prisma.shift.findUnique({
			where: { id: shiftId },
		});

		if (!existing) throw new NotFoundException("This shift does not exist");
		if (
			existing.reporterId != memberId
			&& existing.reporterId != memberId
			&& !await this.members.doMemberHavePermission(memberId, PERMISSIONS.SHIFT.EDIT_ANY_SHIFT)
		) {
			throw new ForbiddenException("You cannot edit this shift");
		}

		const date = data.date
			? new Date(data.date)
			: undefined;

		const existing_date_type = await this.prisma.shift.findUnique({
			where: { date_typeId: { date: date ?? existing.date, typeId: data.type ?? existing.typeId } },
		});

		if (existing_date_type && existing_date_type.id != existing.id) {
			throw new ConflictException("A shift of this type already exist for this date");
		}

		try {
			await this.prisma.shift.update({
				where: { id: shiftId },
				data: {
					date,
					managerId: data.manager,
					typeId: data.type,
				},
			});

			return this.getShift(shiftId);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
				throw new NotFoundException("Invalid manager id");
			}
			throw new InternalServerErrorException("An error occured while creating the shift");
		}
	}
}
