import { z } from "zod";

export const auth42Schema = z.object({
	code: z.string(),
	state: z.string(),
});

export type Auth42Dto = z.infer<typeof auth42Schema>;
