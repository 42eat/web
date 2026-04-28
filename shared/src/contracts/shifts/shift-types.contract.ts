import { initContract } from "@ts-rest/core";
import { createShiftTypeSchema, editShiftTypeSchema, shiftTypeSchema, shiftTypesSchema } from "./schemas/shift-types.schema";
import { idParamSchema } from "../schemas/common.schema";
import { errorDefaultSchema } from "../schemas/error-default";

const c = initContract();

export const shiftTypesContract = c.router(
	{
		getTypes: {
			method: "GET",
			path: "/",
			responses: { 200: shiftTypesSchema },
		},
		getType: {
			method: "GET",
			path: "/:id",
			pathParams: idParamSchema,
			responses: {
				200: shiftTypeSchema,
				404: errorDefaultSchema,
			},
		},
		createType: {
			method: "POST",
			path: "/",
			body: createShiftTypeSchema,
			responses: { 200: shiftTypeSchema },
		},
		editType: {
			method: "PATCH",
			path: "/:id",
			pathParams: idParamSchema,
			body: editShiftTypeSchema,
			responses: {
				200: shiftTypeSchema,
				404: errorDefaultSchema,
			},
		},
		deleteType: {
			method: "DELETE",
			path: "/:id",
			pathParams: idParamSchema,
			responses: { 204: null },
		},
	},
	{ pathPrefix: "/types" },
);
