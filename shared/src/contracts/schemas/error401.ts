import { z } from "zod";

function error401SchemaVariant<T extends readonly [string, ...(string)[]]>(enumArray: T) {
	return z.object({
		statusCode: z.literal(401),
		error: z.string(),
		message: z.string(),
		code: z.enum(enumArray),
	});
}

export const baseCode401 = [
	"INVALID_REFRESH_TOKEN",
	"INVALID_TOKEN",
	"UNAUTHORIZED",
] as const;

export const authCode401 = [
	"INVALID_CREDENTIALS",
	"INTRA_ONLY_ACCOUNT",
] as const;

export const code401 = [...baseCode401, ...authCode401] as const;

export type BaseCode401 = (typeof baseCode401)[number];
export type AuthCode401 = (typeof authCode401)[number];
export type Code401 = (typeof code401)[number];

export const error401BaseSchema = error401SchemaVariant(baseCode401);
export const error401AuthSchema = error401SchemaVariant(authCode401);
export const error401Schema = error401SchemaVariant(code401);
