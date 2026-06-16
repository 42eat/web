import { z } from "zod";

export const shiftTypeSchema = z.object({
	id: z.number(),
	type: z.string(),
	xpMult: z.number(),
});
export type ShiftTypeResponse = z.infer<typeof shiftTypeSchema>;

export const shiftTypesSchema = z.array(shiftTypeSchema);
export type ShiftTypesResponse = z.infer<typeof shiftTypesSchema>;

export const createShiftTypeSchema = z.object({
	type: z.string(),
	xpMult: z.number().optional(),
});
export type CreateShiftTypeDto = z.infer<typeof createShiftTypeSchema>;

export const editShiftTypeSchema = createShiftTypeSchema.partial();
export type EditShiftTypeDto = z.infer<typeof editShiftTypeSchema>;
