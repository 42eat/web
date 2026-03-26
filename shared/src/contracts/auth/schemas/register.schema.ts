import { z } from 'zod'

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	displayName: z.string(),
})

export type RegisterDto = z.infer<typeof RegisterSchema>