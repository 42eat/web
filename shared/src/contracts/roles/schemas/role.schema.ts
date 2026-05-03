import { z } from "zod";
import { memberBasicSchema } from "../../members/schemas/member.schema";
import { permissionValues } from "../../../core/permissions";
import { colorRegex } from "../../schemas/color";

export const createRoleSchema = z.object({
	name: z.string(),
	defaultRole: z.boolean().optional(),
	displayColor: z.string().regex(colorRegex, "Invalid hex color").optional(),
});
export type CreateRoleDto = z.infer<typeof createRoleSchema>;

export const editRoleSchema = z.object({
	name: z.string().optional(),
	defaultRole: z.boolean().optional(),
	displayColor: z.string().regex(colorRegex, "Invalid hex color").optional(),
});
export type EditRoleDto = z.infer<typeof editRoleSchema>;

export const roleResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	superRole: z.boolean(),
	defaultRole: z.boolean(),
	displayColor: z.string().regex(colorRegex, "Invalid hex color").nullable(),
	permissions: z.array(z.string()),
});
export type RoleResponse = z.infer<typeof roleResponseSchema>;

export const rolesListResponseSchema = z.array(
	z.object({
		id: z.number(),
		name: z.string(),
		superRole: z.boolean(),
		defaultRole: z.boolean(),
		displayColor: z.string().regex(colorRegex, "Invalid hex color").nullable(),
	}),
);
export type RolesListResponse = z.infer<typeof rolesListResponseSchema>;

export const rolesListDetailedResponseSchema = z.array(roleResponseSchema);
export type RolesListDetailedResponse = z.infer<
	typeof rolesListDetailedResponseSchema
>;

export const roleMembersResponseSchema = z.array(memberBasicSchema);
export type RoleMembersResponse = z.infer<typeof roleMembersResponseSchema>;

export const permissionListSchema = z.array(z.enum(permissionValues));
export type PermissionListDto = z.infer<typeof permissionListSchema>;
