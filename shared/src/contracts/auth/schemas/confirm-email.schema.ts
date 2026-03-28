import { z } from "zod";

export const ConfirmEmailSchema = z.object({
	token: z.string(),
});

export type ConfirmEmailDto = z.infer<typeof ConfirmEmailSchema>;
