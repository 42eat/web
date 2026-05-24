import { z } from "zod";

export const error429Schema = z.object({
	statusCode: z.literal(429),
	error: z.string(),
	message: z.string(),
	retryAfter: z.number(),
});
