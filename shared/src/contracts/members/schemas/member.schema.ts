import { z } from 'zod'

export const MemberSchema = z.object({
	email: z.string().email().nullable(),
	login: z.string().nullable(),
	nickname: z.string().nullable(),
	joinDate: z.date().nullable(),
})

export type MemberDto = z.infer<typeof MemberSchema>