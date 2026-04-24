import { z } from "zod";
import { memberSchema } from "../../members/schemas/member.schema";
import { shiftTypeSchema } from "./shift-types.schema";
import { shiftPositionSchema } from "./shift-positions.schema";

export const shiftSchema = z.object({
	id: z.number(),
	date: z.date(),
	type: shiftTypeSchema,
	manager: memberSchema,
	members: z.array(z.object({
		member: memberSchema,
		position: shiftPositionSchema.nullable(),
	})),
	validated: z.boolean(),
});
export type ShiftResponse = z.infer<typeof shiftSchema>;

export const createShiftSchema = z.object({
	date: z.date(),
	type: z.number(),
	manager: z.number(),
	members: z.array(z.object({
		member: z.number(),
		position: z.number().nullable(),
	})),
});
export type CreateShiftDto = z.infer<typeof createShiftSchema>;
