import { z } from "zod";

export const error400Schema = z.object({
	statusCode: z.literal(400),
	error: z.string(),
	message: z.array(z.string()).or(z.string()),
});
