import { z } from "zod";

export const authResponseSchema = z.object({
	accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
