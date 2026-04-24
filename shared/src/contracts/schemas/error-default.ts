import { z } from "zod";

export const errorDefaultSchema = z.object({
	statusCode: z.literal(403),
	error: z.string(),
	message: z.string(),
});
export type ErrorDefaultResponse = z.infer<typeof errorDefaultSchema>;
