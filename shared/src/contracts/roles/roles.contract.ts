import { initContract } from "@ts-rest/core";
import {
	createRoleSchema,
	editRoleSchema,
	permissionListSchema,
	roleMembersResponseSchema,
	roleResponseSchema,
	rolesListDetailedResponseSchema,
	rolesListResponseSchema,
} from "./schemas/role.schema";
import { idParamSchema } from "../schemas/common.schema";

const c = initContract();

export const rolesContract = c.router(
	{
		createRole: {
			method: "POST",
			path: "/",
			body: createRoleSchema,
			responses: { 204: null },
		},
		listRolesDetailed: {
			method: "GET",
			path: "/detailed",
			responses: { 200: rolesListDetailedResponseSchema },
		},
		editRole: {
			method: "PATCH",
			path: "/:id",
			pathParams: idParamSchema,
			body: editRoleSchema,
			responses: { 204: null },
		},
		deleteRole: {
			method: "DELETE",
			path: "/:id",
			pathParams: idParamSchema,
			responses: { 204: null },
		},
		getRole: {
			method: "GET",
			path: "/:id",
			pathParams: idParamSchema,
			responses: { 200: roleResponseSchema },
		},
		listRoles: {
			method: "GET",
			path: "/",
			responses: { 200: rolesListResponseSchema },
		},
		getRoleMembers: {
			method: "GET",
			path: "/:id/members",
			pathParams: idParamSchema,
			responses: { 200: roleMembersResponseSchema },
		},
		addRolePermissions: {
			method: "POST",
			path: "/:id/permissions",
			body: permissionListSchema,
			pathParams: idParamSchema,
			responses: { 204: null },
		},
		removeRolePermissions: {
			method: "DELETE",
			path: "/:id/permissions",
			body: permissionListSchema,
			pathParams: idParamSchema,
			responses: { 204: null },
		},
		setRolePermissions: {
			method: "PUT",
			path: "/:id/permissions",
			body: permissionListSchema,
			pathParams: idParamSchema,
			responses: { 204: null },
		},
	},
	{ pathPrefix: "/roles" },
);
