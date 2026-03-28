import { z } from "zod";

export const AuthResponseSchema = z.object({
	accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
