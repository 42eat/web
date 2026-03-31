import { initContract } from "@ts-rest/core";
import { permissionsResponseSchema } from "./schemas/permission.schema";

const c = initContract();

export const permissionsContract = c.router(
	{
		getPermissionList: {
			method: "GET",
			path: "/",
			responses: { 200: permissionsResponseSchema },
		},
	},
	{ pathPrefix: "/permissions" },
);
