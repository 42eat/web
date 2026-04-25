import z, { ZodSchema } from "zod";

export function validatorFromZod<S extends ZodSchema>(zodSchema: S) {
	return (input: z.input<typeof zodSchema>) => {
		const result = zodSchema.safeParse(input);
		if (!result.success) return result.error.issues[0].message;
	};
}

export function validateFromZod<S extends ZodSchema>(zodSchema: S, input: z.input<typeof zodSchema>) {
	const result = zodSchema.safeParse(input);
	if (!result.success) return result.error.issues[0].message;
}
