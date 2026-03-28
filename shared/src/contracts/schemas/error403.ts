import { z } from "zod";

export const validCode403 = <const>[
	"INVALID_PERMISSION",
	"EMAIL_NOT_VERIFIED",
	"FORBIDDEN",
];
export type code403 = (typeof validCode403)[number];

export const Error403Schema = z.object({
	statusCode: z.literal(403),
	error: z.string(),
	message: z.string(),
	code: z.enum(validCode403),
});
