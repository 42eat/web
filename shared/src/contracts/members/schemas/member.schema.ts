import { z } from "zod";

export const MemberSchema = z.object({
	id: z.number(),
	email: z.string().email(),
	login: z.string().nullable(),
	displayName: z.string().nullable(),
	joinDate: z.date().nullable(),
});
export type MemberDto = z.infer<typeof MemberSchema>;

export const AddRoleMemberSchema = z.object({
	roleId: z.number(),
});
export type AddRoleMemberDto = z.infer<typeof AddRoleMemberSchema>;

export const DeleteRoleParamSchema = z.object({
	id: z.string().transform(Number),
	roleId: z.string().transform(Number),
});
