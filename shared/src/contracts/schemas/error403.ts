import { z } from "zod";

export const validCode403 = [
	"INVALID_PERMISSION",
	"EMAIL_NOT_VERIFIED",
	"FORBIDDEN",
] as const;

export type Code403 = (typeof validCode403)[number];

export const error403Schema = z.object({
	statusCode: z.literal(403),
	error: z.string(),
	message: z.string(),
	code: z.enum(validCode403),
});
