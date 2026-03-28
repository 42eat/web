import { initContract } from "@ts-rest/core";
import { authContract } from "./auth/auth.contract";
import { membersContract } from "./members/members.contract";
import { rolesContract } from "./roles/roles.contract";
import { permissionsContract } from "./permissions/permissions.contract";
import { Error401Schema } from "./schemas/error401";

const c = initContract();

export const appContract = c.router(
	{
		auth: authContract,
		members: membersContract,
		roles: rolesContract,
		permissions: permissionsContract,
	},
	{
		commonResponses: {
			401: Error401Schema,
		},
	},
);
