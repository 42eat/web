import { z } from "zod";

export const code403 = [
	"INVALID_PERMISSION",
	"EMAIL_NOT_VERIFIED",
	"FORBIDDEN",
] as const;

export type Code403 = (typeof code403)[number];

export const error403Schema = z.object({
	statusCode: z.literal(403),
	error: z.string(),
	message: z.string(),
	code: z.enum(code403),
});
