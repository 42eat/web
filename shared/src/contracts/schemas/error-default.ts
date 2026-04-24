import { z } from "zod";

export const errorDefaultSchema = z.object({
	statusCode: z.number(),
	error: z.string(),
	message: z.string(),
});
export type ErrorDefaultResponse = z.infer<typeof errorDefaultSchema>;
