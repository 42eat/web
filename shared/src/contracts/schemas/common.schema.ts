import z from "zod";

export const idParamSchema = z.object({
	id: z.string().transform(Number),
});
