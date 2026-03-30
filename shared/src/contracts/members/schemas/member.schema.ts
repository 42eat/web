import { z } from "zod";

export const memberSchema = z.object({
	id: z.number(),
	email: z.string().email(),
	login: z.string().nullable(),
	displayName: z.string().nullable(),
	joinDate: z.date().nullable(),
});
export type MemberDto = z.infer<typeof memberSchema>;

export const addRoleMemberSchema = z.object({
	roleId: z.number(),
});
export type AddRoleMemberDto = z.infer<typeof addRoleMemberSchema>;

export const DeleteRoleParamSchema = z.object({
	id: z.string().transform(Number),
	roleId: z.string().transform(Number),
});
