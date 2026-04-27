import { initContract } from "@ts-rest/core";
import { shiftPositionsContract } from "./shift-positions.contract";
import { shiftTypesContract } from "./shift-types.contract";
import { addShiftMemberSchema, createShiftSchema, deleteShiftMemberParamSchema, editShiftSchema, shiftSchema, shiftsSchema } from "./schemas/shifts.schema";
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
		editShift: {
			method: "PATCH",
			path: "/:id",
			pathParams: idParamSchema,
			body: editShiftSchema,
			responses: { 200: shiftSchema },
		},
		addShiftMember: {
			method: "POST",
			path: "/:id/members",
			pathParams: idParamSchema,
			body: addShiftMemberSchema,
			responses: { 204: null },
		},
		deleteShiftMember: {
			method: "DELETE",
			path: "/:id/members/:memberId",
			pathParams: deleteShiftMemberParamSchema,
			responses: { 204: null },
		},
	},
	{ pathPrefix: "/shifts" },
);
