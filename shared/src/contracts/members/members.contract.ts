import { initContract } from "@ts-rest/core";
import {
	addRoleMemberSchema,
	DeleteRoleParamSchema,
	memberSchema,
} from "./schemas/member.schema";
import {
	rolesListDetailedResponseSchema,
	rolesListResponseSchema,
} from "../roles/schemas/role.schema";
import { idParamSchema } from "../schemas/common.schema";

const c = initContract();

export const membersContract = c.router(
	{
		profile: {
			method: "GET",
			path: "/profile",
			responses: { 200: memberSchema },
		},
		getMemberRoles: {
			method: "GET",
			path: "/:id/roles",
			pathParams: idParamSchema,
			responses: { 200: rolesListResponseSchema },
		},
		getMemberRolesDetailed: {
			method: "GET",
			path: "/:id/roles/detailed",
			pathParams: idParamSchema,
			responses: { 200: rolesListDetailedResponseSchema },
		},
		addMemberRole: {
			method: "POST",
			path: "/:id/roles",
			pathParams: idParamSchema,
			body: addRoleMemberSchema,
			responses: { 204: null },
		},
		removeMemberRole: {
			method: "DELETE",
			path: "/:id/roles/:roleId",
			pathParams: DeleteRoleParamSchema,
			responses: { 204: null },
		},
	},
	{ pathPrefix: "/members" },
);
