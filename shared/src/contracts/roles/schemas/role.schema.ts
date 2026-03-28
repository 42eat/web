import { z } from 'zod'
import { MemberSchema } from '../../members/schemas/member.schema';
import { permissionValues } from '../../../core/permissions';
import { colorRegex } from '../../schemas/color';


export const CreateRoleSchema = z.object({
	name: z.string(),
	defaultRole: z.boolean().optional(),
	displayColor: z.string().regex(colorRegex, "Invalid hex color").optional(),
});
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>


export const EditRoleSchema = z.object({
	name: z.string().optional(),
	defaultRole: z.boolean().optional(),
	displayColor: z.string().regex(colorRegex, "Invalid hex color").optional(),
});
export type EditRoleDto = z.infer<typeof EditRoleSchema>


export const RoleResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	superRole: z.boolean(),
	defaultRole: z.boolean(),
	displayColor: z.string().regex(colorRegex, "Invalid hex color").nullable(),
	permissions: z.array(z.string())
});
export type RoleResponse = z.infer<typeof RoleResponseSchema>


export const RolesListResponseSchema = z.array(z.object({
	id: z.number(),
	name: z.string(),
	superRole: z.boolean(),
	defaultRole: z.boolean(),
	displayColor: z.string().regex(colorRegex, "Invalid hex color").nullable(),
}));
export type RolesListResponse = z.infer<typeof RolesListResponseSchema>


export const RolesListDetailedResponseSchema = z.array(RoleResponseSchema)
export type RolesListDetailedResponse = z.infer<typeof RolesListDetailedResponseSchema>


export const RoleMembersResponseSchema = z.array(MemberSchema)
export type RoleMembersResponse = z.infer<typeof RoleMembersResponseSchema>


export const PermissionListSchema = z.array(
	z.enum(permissionValues)
);
export type PermissionListDto = z.infer<typeof PermissionListSchema>

