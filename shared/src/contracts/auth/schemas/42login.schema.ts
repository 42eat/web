import { z } from "zod";

export const auth42Schema = z.object({
	code: z.string(),
	state: z.string(),
});

export type Auth42Dto = z.infer<typeof auth42Schema>;

export const auth42UrlSchema = z.object({
	url: z.string(),
});

export type Auth42UrlRespone = z.infer<typeof auth42UrlSchema>;
