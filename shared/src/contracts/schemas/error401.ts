import { z } from "zod";

export const validCode401 = <const>[
	"INVALID_CREDENTIALS",
	"INVALID_REFRESH_TOKEN",
	"INVALID_TOKEN",
	"UNAUTHORIZED",
];
export type code401 = (typeof validCode401)[number];

export const Error401Schema = z.object({
	statusCode: z.literal(401),
	error: z.string(),
	message: z.string(),
	code: z.enum(validCode401),
});
