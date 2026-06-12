import { initContract } from "@ts-rest/core";
import { AppVariableParam, editAppVariable, getAppVariables } from "./schemas/app-config.schema";
import { errorDefaultSchema } from "../schemas/error-default";

const c = initContract();

export const appConfigContract = c.router(
	{
		getVariables: {
			method: "GET",
			path: "/",
			responses: {
				200: getAppVariables,
			},
		},
		editVariable: {
			method: "PATCH",
			path: "/:key",
			pathParams: AppVariableParam,
			body: editAppVariable,
			responses: {
				204: null,
				404: errorDefaultSchema,
			},
		},
	},
	{ pathPrefix: "/config" },
);
