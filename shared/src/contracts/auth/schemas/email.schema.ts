import { z } from "zod";

export const requestEmailResetSchema = z.object({
	password: z.string(),
	newEmail: z.string().email(),
});

export type RequestEmailResetDto = z.infer<typeof requestEmailResetSchema>;

export const resetEmailSchema = z.object({
	token: z.string(),
});

export type ResetEmailDto = z.infer<typeof resetEmailSchema>;
