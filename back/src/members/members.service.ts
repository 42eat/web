import { Injectable, NotFoundException } from "@nestjs/common";
import { Member } from "../generated/prisma/client";
import { PrismaService } from "../core/prisma/prisma.service";
import { Permission } from "@42eat-web/shared";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class MembersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly roles: RolesService,
	) {}

	public async getAll(): Promise<Member[]> {
		return this.prisma.member.findMany();
	}

	public async getByEmail(email: string): Promise<Member | null> {
		return this.prisma.member.findUnique({ where: { email: email } });
	}

	public async getById(id: number): Promise<Member> {
		const member = await this.prisma.member.findUnique({ where: { id: id } });
		if (!member) {
			throw new NotFoundException("Cannot load the user profile");
		}
		return member;
	}

	public async create(
		email: string,
		password: string,
		nickname: string | null = null,
	): Promise<Member | null> {
		const newMember = await this.prisma.member.create({
			data: { email, password, nickname },
		});

		// const defaultRoles = this.roles.getDefaultRoles();
		// await this.prisma.memberRole.createMany({
		// 	data: defaultRoles.map((roleId) => ({ roleId, memberId: newMember.id })),
		// });

		return newMember;
	}

	public async getMemberRoles(memberId: number) {
		const memberRoles = await this.prisma.memberRole.findMany({
			where: { memberId },
			include: {
				roleRef: true,
			},
		});
		return memberRoles.map((role) => role.roleRef);
	}

	public async getMemberRolesDetailed(memberId: number) {
		const memberRoles = await this.prisma.memberRole.findMany({
			where: { memberId },
			include: {
				roleRef: {
					include: {
						rolePermissions: {
							select: { permission: true },
						},
					},
				},
			},
		});
		return memberRoles.map(({ roleRef }) => ({
			...roleRef,
			permissions: roleRef.rolePermissions.map((rp) => rp.permission),
			rolePermissions: undefined,
		}));
	}

	public async addRoleToMember(memberId: number, roleId: number) {
		await this.prisma.memberRole.create({
			data: {
				memberId: memberId,
				roleId: roleId,
			},
		});
	}

	public async removeRoleFromMember(memberId: number, roleId: number) {
		await this.prisma.memberRole.deleteMany({
			where: {
				memberId: memberId,
				roleId: roleId,
			},
		});
	}

	private async doMemberBypassPermission(memberId: number) {
		const memberSuperRole = await this.prisma.memberRole.findFirst({
			where: {
				memberId: memberId,
				roleRef: { superRole: true },
			},
		});
		return memberSuperRole !== null;
	}

	public async doMemberHavePermission(
		memberId: number,
		permission: Permission,
	) {
		if (await this.doMemberBypassPermission(memberId)) return true;

		const memberPerm = await this.prisma.memberRole.findFirst({
			where: {
				memberId: memberId,
				roleRef: {
					rolePermissions: {
						some: { permission },
					},
				},
			},
		});
		return memberPerm !== null;
	}

	public async verifyEmail(memberId: number) {
		await this.prisma.member.update({
			where: { id: memberId },
			data: { emailValidated: true },
		});
	}
}
