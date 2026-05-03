import { z } from "zod";

export const profileSchema = z.object({
	id: z.number(),
	email: z.string().email(),
	login: z.string().nullable(),
	displayName: z.string().nullable(),
	joinDate: z.date().nullable(),
});

export const memberSchema = z.object({
	id: z.number(),
	login: z.string().nullable(),
	displayName: z.string().nullable(),
	joinDate: z.date().nullable(),
	// + liste des roles et toutes les choses a display sur un profile
});

export const memberBasicSchema = z.object({
	id: z.number(),
	login: z.string().nullable(),
	displayName: z.string().nullable(),
});

export const addRoleMemberSchema = z.object({
	roleId: z.number(),
});

export const DeleteRoleParamSchema = z.object({
	id: z.string().transform(Number),
	roleId: z.string().transform(Number),
});
