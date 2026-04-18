import { z } from "zod";

const envSchema = z.object({
	VITE_API_URL: z.string(),
	VITE_DEFAULT_LANG: z.enum(["en", "fr"]),
});

let result;
try {
	result = envSchema.parse(import.meta.env);
} catch (e) {
	if (!(e instanceof z.ZodError)) throw e;
	console.error(e.issues.map((issue) => `env.${issue.path[0]}: ${issue.message}`).join("\n"));
	throw new Error("Invalid env provided", { cause: e });
}

export const env = result;
