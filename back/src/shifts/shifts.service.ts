import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { AddShiftMemberDto, EditShiftDto, ShiftWithoutCanEdit, shiftWithoutCanEditSchema, CreateShiftDto, PERMISSIONS } from "@42eat-web/shared";
import { Prisma } from "../generated/prisma/client";
import { MembersService } from "../members/members.service";
import { AppForbiddenException } from "../core/error/forbidden";

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
				reporter: {},
			},
		});
		return shifts.map(
			({ shiftMembers, ...rest }) => (shiftWithoutCanEditSchema.parse({ ...rest, members: shiftMembers })),
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
				reporter: {},
			},
		});
		if (!shift) throw new NotFoundException("Shift does not exist");
		const { shiftMembers, ...rest } = shift;
		return shiftWithoutCanEditSchema.parse({ ...rest, members: shiftMembers });
	}

	public async addCanEditShift(shift: ShiftWithoutCanEdit, memberId: number) {
		return {
			...shift,
			canEdit: await this.doMemberHaveShiftEditPermission(
				memberId,
				{ reporterId: shift.reporter.id, managerId: shift.manager.id, validated: shift.validated },
			),
		};
	}

	public async addCanEditShiftList(shifts: ShiftWithoutCanEdit[], memberId: number) {
		const canEditAll = await this.members.doMemberHavePermission(memberId, PERMISSIONS.SHIFT.EDIT_ANY_SHIFT);
		if (canEditAll) {
			return shifts.map((shift) => ({ ...shift, canEdit: true }));
		} else {
			return shifts.map((shift) => ({
				...shift,
				canEdit: (shift.reporter.id === memberId || shift.manager.id === memberId) && !shift.validated,
			}));
		}
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

	private async doMemberHaveShiftEditPermission(
		memberId: number,
		shift: { reporterId: number; managerId: number; validated: boolean },
	): Promise<boolean> {
		return ((
			(shift.reporterId === memberId || shift.managerId === memberId)
			&& !shift.validated
		)
		|| await this.members.doMemberHavePermission(memberId, PERMISSIONS.SHIFT.EDIT_ANY_SHIFT));
	}

	private async canMemberEditShift(
		shiftId: number,
		memberId: number,
		typeId?: number,
		date?: Date,
	) {
		const existing = await this.prisma.shift.findUnique({
			where: { id: shiftId },
		});

		if (!existing) throw new NotFoundException("This shift does not exist");

		if (!await this.doMemberHaveShiftEditPermission(memberId, existing)) {
			throw new AppForbiddenException("FORBIDDEN", "You cannot edit this shift");
		}

		const existing_date_type = await this.prisma.shift.findUnique({
			where: { date_typeId: { date: date ?? existing.date, typeId: typeId ?? existing.typeId } },
		});

		if (existing_date_type && existing_date_type.id != existing.id) {
			throw new ConflictException("A shift of this type already exist for this date");
		}
	}

	public async editShift(shiftId: number, data: EditShiftDto, memberId: number) {
		const date = data.date
			? new Date(data.date)
			: undefined;

		await this.canMemberEditShift(shiftId, memberId, data.type, date);

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

	public async addShiftMember(shiftId: number, data: AddShiftMemberDto, memberId: number) {

		await this.canMemberEditShift(shiftId, memberId);

		const existing_member = await this.prisma.shiftMember.findFirst({
			where: {
				shiftId,
				memberId: data.member,
			},
		});
		if (existing_member) throw new ConflictException("You are already on this shift");

		const existing_position = await this.prisma.shiftMember.findFirst({
			where: {
				shiftId,
				positionId: data.position,
			},
		});
		if (existing_position) throw new ConflictException("There is already someone with this position on this shift");

		try {
			await this.prisma.shiftMember.create({
				data: { shiftId: shiftId, memberId: data.member, positionId: data.position },
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
				throw new NotFoundException("Invalid manager id");
			}
			throw new InternalServerErrorException("An error occured while creating the shift");
		}
	}

	public async deleteShiftMember(shiftId: number, shiftMemberId: number, memberId: number) {

		await this.canMemberEditShift(shiftId, memberId);

		await this.prisma.shiftMember.delete({
			where: { shiftId_memberId: { shiftId: shiftId, memberId: shiftMemberId } },
		});
	}

	public async deleteShift(shiftId: number, memberId: number) {
		await this.canMemberEditShift(shiftId, memberId);
		await this.prisma.shift.delete({ where: { id: shiftId } });
	}

	public async validateShift(shiftId: number) {
		await this.prisma.shift.update({ where: { id: shiftId }, data: { validated: true } });
	}
}
