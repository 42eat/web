import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { Permission } from "@42eat-web/shared";
import { AppForbiddenException } from "../core/error/forbidden";

@Injectable()
export class RolesService {
	constructor(private readonly prisma: PrismaService) {}

	public async createRole(
		name: string,
		defaultRole: boolean | undefined,
		displayColor: string | undefined,
	) {
		const role = await this.prisma.role.create({
			data: { name, defaultRole, displayColor },
		});
		return role;
	}

	public async editRole(
		roleId: number,
		name: string | undefined,
		defaultRole: boolean | undefined,
		displayColor: string | undefined,
	) {
		const role = await this.prisma.role.update({
			where: { id: roleId },
			data: { name, defaultRole, displayColor },
		});
		return role;
	}

	public async deleteRole(roleId: number) {
		const role = await this.prisma.role.findUnique({ where: { id: roleId } });

		if (!role) throw new NotFoundException("Role does not exist");
		if (role.superRole)
			throw new AppForbiddenException("FORBIDDEN", "Cannot delete this role");

		return this.prisma.role.delete({ where: { id: roleId } });
	}

	public async getRole(roleId: number) {
		const role = await this.prisma.role.findUnique({
			where: { id: roleId },
			include: {
				rolePermissions: {
					select: {
						permission: true,
					},
				},
			},
		});

		if (!role) throw new NotFoundException("Role does not exist");

		const { rolePermissions, ...rest } = role;
		return {
			...rest,
			permissions: rolePermissions.map((rp) => rp.permission),
		};
	}

	public async getRoles() {
		const roles = await this.prisma.role.findMany();

		return roles;
	}

	public async getRolesDetailed() {
		const roles = await this.prisma.role.findMany({
			include: {
				rolePermissions: {
					select: {
						permission: true,
					},
				},
			},
		});

		return roles.map(({ rolePermissions, ...rest }) => ({
			...rest,
			permissions: rolePermissions.map((rp) => rp.permission),
		}));
	}

	public async getRoleMembers(roleId: number) {
		const roleMembers = await this.prisma.memberRole.findMany({
			where: { roleId },
			include: {
				memberRef: true,
			},
		});

		return roleMembers.map((member) => member.memberRef);
	}

	public async addRolePermissions(roleId: number, permissions: Permission[]) {
		await this.prisma.rolePermission.createMany({
			data: permissions.map((permission) => ({ roleId, permission })),
			skipDuplicates: true,
		});
	}

	public async removeRolePermissions(
		roleId: number,
		permissions: Permission[],
	) {
		await this.prisma.rolePermission.deleteMany({
			where: { roleId: roleId, permission: { in: permissions } },
		});
	}

	public async setRolePermissions(roleId: number, permissions: Permission[]) {
		await this.prisma.$transaction([
			this.prisma.rolePermission.deleteMany({ where: { roleId } }),
			this.prisma.rolePermission.createMany({
				data: permissions.map((permission) => ({ roleId, permission })),
				skipDuplicates: true,
			}),
		]);
	}

	public async getDefaultRoles() {
		return this.prisma.role.findMany({
			where: { defaultRole: true },
			select: { id: true },
		});
	}
}
