import z from "zod";

const EnvSchema = z.object({
	VITE_API_URL: z.string(),
	VITE_DEFAULT_LANG: z.enum(["en", "fr"]),
});

const result = EnvSchema.safeParse(import.meta.env);

if (!result.success) {
	console.error(
		"Invalid environment variables:",
		result.error.flatten().fieldErrors,
	);
	process.exit(1);
}

export const env = result.data;
