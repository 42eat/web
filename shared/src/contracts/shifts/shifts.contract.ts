import { initContract } from "@ts-rest/core";
import { shiftPositionsContract } from "./shift-positions.contract";
import { shiftTypesContract } from "./shift-types.contract";
import { createShiftSchema, shiftSchema, shiftsSchema } from "./schemas/shifts.schema";
import { idParamSchema } from "../schemas/common.schema";

const c = initContract();

export const shiftsContract = c.router(
	{
		positions: shiftPositionsContract,
		types: shiftTypesContract,
		getShifts: {
			method: "GET",
			path: "/",
			responses: { 200: shiftsSchema },
		},
		getShift: {
			method: "GET",
			path: "/:id",
			pathParams: idParamSchema,
			responses: { 200: shiftSchema },
		},
		createShift: {
			method: "POST",
			path: "/",
			body: createShiftSchema,
			responses: { 200: shiftSchema },
		},
	},
	{ pathPrefix: "/shifts" },
);
