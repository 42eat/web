import { z } from "zod";

export const confirmEmailSchema = z.object({
	token: z.string(),
});

export type ConfirmEmailDto = z.infer<typeof confirmEmailSchema>;
