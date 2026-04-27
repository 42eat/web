import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { CreateShiftDto } from "@42eat-web/shared";

@Injectable()
export class ShiftsService {
	constructor(private readonly prisma: PrismaService) {}

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
				managerRef: {},
			},
		});
		return shifts.map(
			({ shiftMembers, managerRef, ...rest }) => ({ ...rest, members: shiftMembers, manager: managerRef }),
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
				managerRef: {},
			},
		});
		if (!shift) throw new NotFoundException("Shift does not exist");
		const { shiftMembers, managerRef, ...rest } = shift;
		return { ...rest, members: shiftMembers, manager: managerRef };
	}

	public async createShift(data: CreateShiftDto) {
		let shiftId: number;
		try {
			const insertedShift = await this.prisma.shift.create({
				data: {
					date: data.date,
					manager: data.manager,
					typeId: data.type,
				},
			});
			shiftId = insertedShift.id;
		} catch (_) {
			throw new NotFoundException("Invalid manager or shift type id");
		}

		try {
			await this.prisma.shiftMember.createMany({
				data: data.members.map(
					(m) => ({ shiftId, memberId: m.member, positionId: m.position }),
				),
			});
		} catch (_) {
			throw new NotFoundException("Invalid member or shift position id");
		}

		return this.getShift(shiftId);
	}
}


/*

model Shift {
  id               Int      @id @default(autoincrement())
  date             DateTime
  typeId           Int      @map("type_id")
  manager          Int
  discordMessageId String   @map("discord_message_id")
  validated        Boolean


  type         ShiftType     @relation(fields: [typeId], references: [id])
  managerRef   Member        @relation("ShiftManager", fields: [manager], references: [id])
  shiftMembers ShiftMember[]

  @@map("shifts")
}

model ShiftMember {
  id         Int  @id @default(autoincrement())
  shiftId    Int  @map("shift_id")
  memberId   Int  @map("member_id")
  positionId Int? @map("position_id")

  shift    Shift          @relation(fields: [shiftId], references: [id])
  member   Member         @relation(fields: [memberId], references: [id])
  position ShiftPosition? @relation(fields: [positionId], references: [id])

  @@map("shift_members")
}

*/
