import { Controller } from "@nestjs/common";
import { MembersService } from "./members.service";
import {
	type AuthMember,
	CurrentMember,
} from "../core/decorators/current-member.decorator";
import {
	MemberSchema,
	membersContract,
	RolesListDetailedResponseSchema,
	RolesListResponseSchema,
} from "@42eat-web/shared";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { PERMISSIONS } from "@42eat-web/shared";

@Controller()
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	// @Get("all")
	// @UseGuards(JwtAuthGuard)
	// @HttpCode(HttpStatus.OK)
	// public async getAll() {
	// 	return this.membersService.getAll();
	// }

	@TsRestHandler(membersContract.profile)
	@RequirePermission(PERMISSIONS.MEMBERS.MY_PROFILE)
	public profile(@CurrentMember() authMember: AuthMember) {
		return tsRestHandler(membersContract.profile, async () => {
			const member = await this.membersService.getById(authMember.id);
			return { status: 200, body: MemberSchema.parse(member) };
		});
	}

	@TsRestHandler(membersContract.getMemberRoles)
	@RequirePermission(PERMISSIONS.MEMBERS.GET_ROLES)
	public getMemberRoles() {
		return tsRestHandler(membersContract.getMemberRoles, async ({ params }) => {
			const members = await this.membersService.getMemberRoles(params.id);
			return { status: 200, body: RolesListResponseSchema.parse(members) };
		});
	}

	@TsRestHandler(membersContract.getMemberRolesDetailed)
	@RequirePermission(PERMISSIONS.MEMBERS.GET_ROLES_DETAILED)
	public getMemberRolesDetailed() {
		return tsRestHandler(
			membersContract.getMemberRolesDetailed,
			async ({ params }) => {
				const member = await this.membersService.getMemberRolesDetailed(
					params.id,
				);
				return {
					status: 200,
					body: RolesListDetailedResponseSchema.parse(member),
				};
			},
		);
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
				await this.membersService.removeRoleFromMember(params.id, params.roleId);
				return { status: 204, body: null };
			},
		);
	}
}
