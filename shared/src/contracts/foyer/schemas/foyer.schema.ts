import { z } from "zod";

export const statusSchema = z.object({
	open: z.boolean(),
});

export const setStatusSchema = z.object({
	open: z.boolean(),
});
