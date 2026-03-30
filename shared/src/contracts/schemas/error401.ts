import { z } from "zod";

export const validCode401 = [
	"INVALID_CREDENTIALS",
	"INVALID_REFRESH_TOKEN",
	"INVALID_TOKEN",
	"INTRA_ONLY_ACCOUNT",
	"UNAUTHORIZED",
] as const;

export type Code401 = (typeof validCode401)[number];

export const error401Schema = z.object({
	statusCode: z.literal(401),
	error: z.string(),
	message: z.string(),
	code: z.enum(validCode401),
});
