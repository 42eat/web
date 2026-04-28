import { initContract } from "@ts-rest/core";
import { shiftPositionsContract } from "./shift-positions.contract";
import { shiftTypesContract } from "./shift-types.contract";
import { addShiftMemberSchema, createShiftSchema, deleteShiftMemberParamSchema, editShiftSchema, shiftSchema, shiftsSchema } from "./schemas/shifts.schema";
import { idParamSchema } from "../schemas/common.schema";
import { errorDefaultSchema } from "../schemas/error-default";

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
			responses: {
				200: shiftSchema,
				404: errorDefaultSchema,
			},
		},
		createShift: {
			method: "POST",
			path: "/",
			body: createShiftSchema,
			responses: {
				200: shiftSchema,
				404: errorDefaultSchema, // Arrive dans le cas ou l'id d'un membre/manager/position est invalide
				409: errorDefaultSchema,
			},
		},
		editShift: {
			method: "PATCH",
			path: "/:id",
			pathParams: idParamSchema,
			body: editShiftSchema,
			responses: {
				200: shiftSchema,
				404: errorDefaultSchema, // Si le shift existe pas ou si l'id du manager est invalide
				409: errorDefaultSchema,
			},
		},
		addShiftMember: {
			method: "POST",
			path: "/:id/members",
			pathParams: idParamSchema,
			body: addShiftMemberSchema,
			responses: {
				204: null,
				404: errorDefaultSchema, // Si le shift existe pas ou si l'id du membre/position est invalide
				409: errorDefaultSchema, // Si il y a deja la personne ou quelqu'un avec la position sur le shift
			},
		},
		deleteShiftMember: {
			method: "DELETE",
			path: "/:id/members/:memberId",
			pathParams: deleteShiftMemberParamSchema,
			responses: {
				204: null,
				404: errorDefaultSchema,
			},
		},
		deleteShift: {
			method: "DELETE",
			path: "/:id",
			pathParams: idParamSchema,
			responses: {
				204: null,
				404: errorDefaultSchema,
			},
		},
		validateShift: {
			method: "POST",
			path: "/:id/validate",
			pathParams: idParamSchema,
			body: null,
			responses: {
				204: null,
				404: errorDefaultSchema, // Si le shift existe pas
			},
		},
	},
	{ pathPrefix: "/shifts" },
);
