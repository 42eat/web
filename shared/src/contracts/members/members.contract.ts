import { initContract } from "@ts-rest/core";
import {
	AddRoleMemberSchema,
	DeleteRoleParamSchema,
	MemberSchema,
} from "./schemas/member.schema";
import {
	RolesListDetailedResponseSchema,
	RolesListResponseSchema,
} from "../roles/schemas/role.schema";
import { IdParamSchema } from "../schemas/common.schema";

const c = initContract();

export const membersContract = c.router(
	{
		profile: {
			method: "GET",
			path: "/profile",
			responses: { 200: MemberSchema },
		},
		getMemberRoles: {
			method: "GET",
			path: "/:id/roles",
			pathParams: IdParamSchema,
			responses: { 200: RolesListResponseSchema },
		},
		getMemberRolesDetailed: {
			method: "GET",
			path: "/:id/roles/detailed",
			pathParams: IdParamSchema,
			responses: { 200: RolesListDetailedResponseSchema },
		},
		addMemberRole: {
			method: "POST",
			path: "/:id/roles",
			pathParams: IdParamSchema,
			body: AddRoleMemberSchema,
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
