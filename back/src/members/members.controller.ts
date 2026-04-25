import { Controller, UseGuards } from "@nestjs/common";
import { MembersService } from "./members.service";
import {
	type AuthMember,
	CurrentMember,
} from "../core/decorators/current-member.decorator";
import {
	memberSchema,
	membersContract,
	rolesListDetailedResponseSchema,
	rolesListResponseSchema,
} from "@42eat-web/shared";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { PERMISSIONS } from "@42eat-web/shared";
import { JwtAuthGuardWithoutEmailVerif } from "../core/guards/jwt-auth.guard";

@Controller()
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	@TsRestHandler(membersContract.profile)
	@UseGuards(JwtAuthGuardWithoutEmailVerif)
	public profile(@CurrentMember() authMember: AuthMember) {
		return tsRestHandler(membersContract.profile, async () => {
			const member = await this.membersService.getById(authMember.id);
			return { status: 200, body: memberSchema.parse(member) };
		});
	}

	@TsRestHandler(membersContract.getMemberRoles)
	@RequirePermission(PERMISSIONS.MEMBERS.GET_ROLES)
	public getMemberRoles() {
		return tsRestHandler(membersContract.getMemberRoles, async ({ params }) => {
			const members = await this.membersService.getMemberRoles(params.id);
			return { status: 200, body: rolesListResponseSchema.parse(members) };
		});
	}

	@TsRestHandler(membersContract.getMemberRolesDetailed)
	@RequirePermission(PERMISSIONS.MEMBERS.GET_ROLES_DETAILED)
	public getMemberRolesDetailed() {
		return tsRestHandler(membersContract.getMemberRolesDetailed, async ({ params }) => {
			const member = await this.membersService.getMemberRolesDetailed(params.id);
			return { status: 200, body: rolesListDetailedResponseSchema.parse(member) };
		});
	}

	@TsRestHandler(membersContract.addMemberRole)
	@RequirePermission(PERMISSIONS.MEMBERS.CHANGE_ROLES)
	public addRoleToMember() {
		return tsRestHandler(
			membersContract.addMemberRole,
			async ({ params, body }) => {
				await this.membersService.addRoleToMember(params.id, body.roleId);
				return { status: 204, body: null };
			},
		);
	}

	@TsRestHandler(membersContract.removeMemberRole)
	@RequirePermission(PERMISSIONS.MEMBERS.CHANGE_ROLES)
	public removeRoleFromMember() {
		return tsRestHandler(
			membersContract.removeMemberRole,
			async ({ params }) => {
				await this.membersService.removeRoleFromMember(
					params.id,
					params.roleId,
				);
				return { status: 204, body: null };
			},
		);
	}
}
