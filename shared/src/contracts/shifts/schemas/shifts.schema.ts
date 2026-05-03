import { z } from "zod";
import { memberBasicSchema } from "../../members/schemas/member.schema";
import { shiftTypeSchema } from "./shift-types.schema";
import { shiftPositionSchema } from "./shift-positions.schema";

export const shiftSchema = z.object({
	id: z.number(),
	date: z.date(),
	type: shiftTypeSchema,
	manager: memberBasicSchema,
	reporter: memberBasicSchema,
	members: z.array(z.object({
		member: memberBasicSchema,
		position: shiftPositionSchema.nullable(),
	})),
	validated: z.boolean(),
	canEdit: z.boolean(),
});
export type ShiftResponse = z.infer<typeof shiftSchema>;

export const shiftWithoutCanEditSchema = shiftSchema.omit({ canEdit: true })
export type ShiftWithoutCanEdit = z.infer<typeof shiftWithoutCanEditSchema>

export const shiftsSchema = z.array(shiftSchema);

export const createShiftSchema = z.object({
	date: z.string().date().refine(
		(val) => new Date(val) <= new Date(),
		{ message: 'Shift date cannot be in the future' }
	),
	type: z.number(),
	manager: z.number(),
	members: z.array(z.object({
		member: z.number(),
		position: z.number(),
	})).superRefine((members, ctx) => {
		const memberIds = members.map((m) => m.member);
		const positionIds = members.filter((m) => m.position !== null).map((m) => m.position);

		if (new Set(memberIds).size !== memberIds.length) {
			ctx.addIssue({ code: "custom", message: "Duplicate member in shift" });
		}
		if (new Set(positionIds).size !== positionIds.length) {
			ctx.addIssue({ code: "custom", message: "Duplicate position in shift" });
		}
	}),
});

export type CreateShiftDto = z.infer<typeof createShiftSchema>;

export const editShiftSchema = z.object({
	date: z.string().date().refine(
		(val) => new Date(val) <= new Date(),
		{ message: 'Shift date cannot be in the future' }
	),
	type: z.number(),
	manager: z.number(),
}).partial();

export type EditShiftDto = z.infer<typeof editShiftSchema>;

export const addShiftMemberSchema = z.object({
	member: z.number(),
	position: z.number(),
});

export type AddShiftMemberDto = z.infer<typeof addShiftMemberSchema>;

export const deleteShiftMemberParamSchema = z.object({
	id: z.string().transform(Number),
	memberId: z.string().transform(Number),
});
