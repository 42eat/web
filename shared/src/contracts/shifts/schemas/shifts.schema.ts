import { z } from "zod";
import { memberBasicSchema } from "../../members/schemas/member.schema";
import { shiftTypeSchema } from "./shift-types.schema";
import { shiftPositionSchema } from "./shift-positions.schema";

export const shiftSchema = z.object({
	id: z.number(),
	date: z.date(),
	type: shiftTypeSchema,
	manager: memberBasicSchema,
	members: z.array(z.object({
		member: memberBasicSchema,
		position: shiftPositionSchema.nullable(),
	})),
	validated: z.boolean(),
});

export const shiftsSchema = z.array(shiftSchema);

export const createShiftSchema = z.object({
	date: z.date(),
	type: z.number(),
	manager: z.number(),
	members: z.array(z.object({
		member: z.number(),
		position: z.number().nullable(),
	})),
});

export const editShiftSchema = z.object({
	date: z.date(),
	type: z.number(),
	manager: z.number(),
	members: z.array(z.object({
		member: z.number(),
		position: z.number().nullable(),
	})),
});
