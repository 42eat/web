import z from "zod";

export type code403 = "INVALID_CREDITENTIALS" | "INVALID_REFRESH_TOKEN" | "INVALID_TOKEN" | "INVALID_PERMISSION" | "EMAIL_NOT_VERIFIED";

export const Error403Schema = z.object({
	statusCode: z.literal(403),
	error: z.string(),
	message: z.string(),
	code: z.enum(['INVALID_CREDITENTIALS', 'INVALID_REFRESH_TOKEN', 'INVALID_TOKEN', 'INVALID_PERMISSION', 'EMAIL_NOT_VERIFIED'])
})
