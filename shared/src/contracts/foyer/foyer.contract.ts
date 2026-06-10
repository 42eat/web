import { initContract } from "@ts-rest/core";
import { setStatusSchema, statusSchema } from "./schemas/foyer.schema";

const c = initContract();

export const foyerContract = c.router(
	{
		getStatus: {
			method: "GET",
			path: "/status",
			responses: { 200: statusSchema },
		},
		setStatus: {
			method: "POST",
			path: "/status",
			body: setStatusSchema,
			responses: { 204: null },
		},
	},
	{ pathPrefix: "/foyer" },
);
