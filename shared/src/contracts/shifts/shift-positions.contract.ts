import { initContract } from "@ts-rest/core";
import { createShiftPositionSchema, editShiftPositionSchema, shiftPositionSchema, shiftPositionsSchema } from "./schemas/shift-positions.schema";
import { idParamSchema } from "../schemas/common.schema";
import { errorDefaultSchema } from "../schemas/error-default";

const c = initContract();

export const shiftPositionsContract = c.router(
	{
		getPositions: {
			method: "GET",
			path: "/",
			responses: { 200: shiftPositionsSchema },
		},
		getPosition: {
			method: "GET",
			path: "/:id",
			pathParams: idParamSchema,
			responses: {
				200: shiftPositionSchema,
				404: errorDefaultSchema,
			},
		},
		createPosition: {
			method: "POST",
			path: "/",
			body: createShiftPositionSchema,
			responses: { 200: shiftPositionSchema },
		},
		editPosition: {
			method: "PATCH",
			path: "/:id",
			pathParams: idParamSchema,
			body: editShiftPositionSchema,
			responses: {
				200: shiftPositionSchema,
				404: errorDefaultSchema,
			},
		},
		deletePosition: {
			method: "DELETE",
			path: "/:id",
			pathParams: idParamSchema,
			responses: { 204: null },
		},
	},
	{ pathPrefix: "/positions" },
);
