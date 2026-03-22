import { Controller } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { PERMISSIONS } from "@42eat-web/shared";
import { RolesService } from "./roles.service";
import {
	rolesContract,
	RoleMembersResponseSchema,
	RoleResponseSchema,
	RolesListDetailedResponseSchema,
	RolesListResponseSchema,
} from "@42eat-web/shared";

@Controller()
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@TsRestHandler(rolesContract.createRole)
	@RequirePermission(PERMISSIONS.ROLES.CREATE)
	public createRole() {
		return tsRestHandler(rolesContract.createRole, async ({ body }) => {
			await this.rolesService.createRole(body.name);
			return { status: 204, body: null };
		});
	}

	@TsRestHandler(rolesContract.editRole)
	@RequirePermission(PERMISSIONS.ROLES.EDIT)
	public editRole() {
		return tsRestHandler(rolesContract.editRole, async ({ body, params }) => {
			await this.rolesService.editRole(params.id, body.name);
			return { status: 204, body: null };
		});
	}

	@TsRestHandler(rolesContract.deleteRole)
	@RequirePermission(PERMISSIONS.ROLES.DELETE)
	public deleteRole() {
		return tsRestHandler(rolesContract.deleteRole, async ({ params }) => {
			await this.rolesService.deleteRole(params.id);
			return { status: 204, body: null };
		});
	}

	@TsRestHandler(rolesContract.listRolesDetailed)
	@RequirePermission(PERMISSIONS.ROLES.LIST_DETAILED)
	public getRolesDetailed() {
		return tsRestHandler(rolesContract.listRolesDetailed, async () => {
			const roles = await this.rolesService.getRolesDetailed();
			return {
				status: 200,
				body: RolesListDetailedResponseSchema.parse(roles),
			};
		});
	}

	@TsRestHandler(rolesContract.getRole)
	@RequirePermission(PERMISSIONS.ROLES.DETAILS)
	public getRole() {
		return tsRestHandler(rolesContract.getRole, async ({ params }) => {
			const role = await this.rolesService.getRole(params.id);
			return { status: 200, body: RoleResponseSchema.parse(role) };
		});
	}

	@TsRestHandler(rolesContract.listRoles)
	@RequirePermission(PERMISSIONS.ROLES.LIST)
	public getRoles() {
		return tsRestHandler(rolesContract.listRoles, async () => {
			const roles = await this.rolesService.getRoles();
			return { status: 200, body: RolesListResponseSchema.parse(roles) };
		});
	}

	@TsRestHandler(rolesContract.getRoleMembers)
	@RequirePermission(PERMISSIONS.ROLES.LIST_DETAILED)
	public getRoleMembers() {
		return tsRestHandler(rolesContract.getRoleMembers, async ({ params }) => {
			const roles = await this.rolesService.getRoleMembers(params.id);
			return {
				status: 200,
				body: RoleMembersResponseSchema.parse(roles),
			};
		});
	}

	@TsRestHandler(rolesContract.addRolePermissions)
	@RequirePermission(PERMISSIONS.ROLES.EDIT_PERMISSIONS)
	public addRolePermissions() {
		return tsRestHandler(
			rolesContract.addRolePermissions,
			async ({ params, body }) => {
				await this.rolesService.addRolePermissions(params.id, body);
				return { status: 204, body: null };
			},
		);
	}

	@TsRestHandler(rolesContract.removeRolePermissions)
	@RequirePermission(PERMISSIONS.ROLES.EDIT_PERMISSIONS)
	public removeRolePermissions() {
		return tsRestHandler(
			rolesContract.removeRolePermissions,
			async ({ params, body }) => {
				await this.rolesService.removeRolePermissions(params.id, body);
				return { status: 204, body: null };
			},
		);
	}

	@TsRestHandler(rolesContract.setRolePermissions)
	@RequirePermission(PERMISSIONS.ROLES.EDIT_PERMISSIONS)
	public setRolePermissions() {
		return tsRestHandler(
			rolesContract.setRolePermissions,
			async ({ params, body }) => {
				await this.rolesService.setRolePermissions(params.id, body);
				return { status: 204, body: null };
			},
		);
	}
}
