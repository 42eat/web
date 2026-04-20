import { z } from "zod";

export const shiftPositionSchema = z.object({
	id: z.number(),
	position: z.string(),
	xpMult: z.number(),
});
export type ShiftPositionResponse = z.infer<typeof shiftPositionSchema>;

export const shiftPositionsSchema = z.array(shiftPositionSchema);
export type ShiftPositionsResponse = z.infer<typeof shiftPositionsSchema>;

export const createShiftPositionSchema = z.object({
  position: z.string(),
  xpMult: z.number().optional(),
})
export type CreateShiftPositionDto = z.infer<typeof createShiftPositionSchema>;

export const editShiftPositionSchema = createShiftPositionSchema.partial();
export type EditShiftPositionDto = z.infer<typeof editShiftPositionSchema>;
