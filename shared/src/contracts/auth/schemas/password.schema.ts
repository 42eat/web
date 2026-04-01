import { z } from "zod";

export const changePasswordSchema = z.object({
	oldPassword: z.string(),
	newPassword: z.string().min(8),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

export const requestPasswordResetSchema = z.object({
	email: z.string().email(),
});

export type RequestPasswordResetDto = z.infer<typeof requestPasswordResetSchema>;

export const resetPasswordSchema = z.object({
	token: z.string(),
	newPassword: z.string().min(8),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
