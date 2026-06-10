import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PERMISSIONS } from "@42eat-web/shared";
import * as bcrypt from "bcrypt";
import { env } from "../env";

const MANAGER_PERMISSIONS = [
	PERMISSIONS.MEMBERS.MY_PROFILE,
	PERMISSIONS.MEMBERS.ANY_PROFILE,
	PERMISSIONS.MEMBERS.ALL_PROFILES,
	PERMISSIONS.MEMBERS.GET_ROLES,
	PERMISSIONS.MEMBERS.GET_ROLES_DETAILED,
	PERMISSIONS.ROLES.LIST,
	PERMISSIONS.ROLES.DETAILS,
	PERMISSIONS.ROLES.LIST_MEMBERS,
	PERMISSIONS.SHIFT.GET_SHIFTS,
];

const USER_PERMISSIONS = [
	PERMISSIONS.MEMBERS.MY_PROFILE,
	PERMISSIONS.ROLES.LIST,
	PERMISSIONS.SHIFT.GET_SHIFTS,
];

@Injectable()
export class DatabaseBootstrapService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	public async onModuleInit(): Promise<void> {
		console.log("Seeding...");

		// ─── App config ─────────────────────────────────────────────────────────────

		await this.prisma.appConfig.upsert({
			where: { key: "42api-uid" },
			update: { value: env.API42_CLIENT_UID ?? "" },
			create: { key: "42api-uid", value: env.API42_CLIENT_UID ?? "" },
		});

		await this.prisma.appConfig.upsert({
			where: { key: "42api-secret" },
			update: { value: env.API42_CLIENT_SECRET ?? "" },
			create: { key: "42api-secret", value: env.API42_CLIENT_SECRET ?? "" },
		});

		await this.prisma.appConfig.upsert({
			where: { key: "foyer-open" },
			update: {},
			create: { key: "foyer-open", value: "false" },
		});

		// ─── Roles ───────────────────────────────────────────────────────────────────

		const bigboss = await this.prisma.role.upsert({
			where: { name: "bigboss" },
			update: {},
			create: { name: "bigboss", superRole: true },
		});

		const manager = await this.prisma.role.upsert({
			where: { name: "manager" },
			update: {},
			create: { name: "manager", superRole: false },
		});

		const user = await this.prisma.role.upsert({
			where: { name: "user" },
			update: {},
			create: { name: "user", superRole: false, defaultRole: true },
		});

		// ─── Permissions ─────────────────────────────────────────────────────────────

		await this.prisma.rolePermission.deleteMany({
			where: { roleId: manager.id },
		});
		await this.prisma.rolePermission.deleteMany({ where: { roleId: user.id } });

		await this.prisma.rolePermission.createMany({
			data: MANAGER_PERMISSIONS.map((permission) => ({
				roleId: manager.id,
				permission,
			})),
			skipDuplicates: true,
		});

		await this.prisma.rolePermission.createMany({
			data: USER_PERMISSIONS.map((permission) => ({
				roleId: user.id,
				permission,
			})),
			skipDuplicates: true,
		});

		console.log("Roles created : bigboss (superRole), manager, user");
		console.log("  bigboss     : every permissions (superRole)");
		console.log(`  manager     : ${MANAGER_PERMISSIONS.length} permissions`);
		console.log(`  user        : ${USER_PERMISSIONS.length} permissions`);

		// ─── Users ───────────────────────────────────────────────────────────────────

		const hashedPassword = await bcrypt.hash("abcdefgh", 10);

		const liamMember = await this.prisma.member.upsert({
			where: { email: "liam@test.com" },
			update: {},
			create: {
				email: "liam@test.com",
				login: "lilefebv",
				password: hashedPassword,
				emailValidated: true,
			},
		});

		const chantalMember = await this.prisma.member.upsert({
			where: { email: "chantal@test.com" },
			update: {},
			create: {
				email: "chantal@test.com",
				displayName: "Chantal",
				password: hashedPassword,
				emailValidated: true,
			},
		});

		const machinMember = await this.prisma.member.upsert({
			where: { email: "machin@test.com" },
			update: {},
			create: {
				email: "machin@test.com",
				password: hashedPassword,
				emailValidated: true,
			},
		});

		console.log(
			"Users created : liam@test.com, chantal@test.com, machin@test.com",
		);

		// ─── Member roles ─────────────────────────────────────────────────────────────

		await this.prisma.memberRole.upsert({
			where: {
				memberId_roleId: { memberId: liamMember.id, roleId: bigboss.id },
			},
			update: {},
			create: { memberId: liamMember.id, roleId: bigboss.id },
		});

		await this.prisma.memberRole.upsert({
			where: {
				memberId_roleId: { memberId: chantalMember.id, roleId: manager.id },
			},
			update: {},
			create: { memberId: chantalMember.id, roleId: manager.id },
		});

		await this.prisma.memberRole.upsert({
			where: {
				memberId_roleId: { memberId: machinMember.id, roleId: user.id },
			},
			update: {},
			create: { memberId: machinMember.id, roleId: user.id },
		});

		console.log("Roles asignated : liam→bigboss, chantal→manager, machin→user");

		// ─── Shifts ───────────────────────────────────────────────────────────────────

		await this.prisma.shiftType.upsert({
			where: { type: "Midi" },
			update: {},
			create: {
				type: "Midi",
			},
		});
		await this.prisma.shiftType.upsert({
			where: { type: "Soir" },
			update: {},
			create: {
				type: "Soir",
			},
		});
		await this.prisma.shiftType.upsert({
			where: { type: "Gouter" },
			update: {},
			create: {
				type: "Gouter",
			},
		});

		console.log("Shift types inserted");

		await this.prisma.shiftPosition.upsert({
			where: { position: "Caisse" },
			update: {},
			create: {
				position: "Caisse",
			},
		});
		await this.prisma.shiftPosition.upsert({
			where: { position: "Croq" },
			update: {},
			create: {
				position: "Croq",
			},
		});
		await this.prisma.shiftPosition.upsert({
			where: { position: "Wrap" },
			update: {},
			create: {
				position: "Wrap",
			},
		});

		console.log("Shift positions inserted");

		console.log("Seed finished!");
	}
}
