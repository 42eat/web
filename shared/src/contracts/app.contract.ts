import { initContract } from "@ts-rest/core";
import { authContract } from "./auth/auth.contract";
import { membersContract } from "./members/members.contract";
import { rolesContract } from "./roles/roles.contract";
import { permissionsContract } from "./permissions/permissions.contract";
import { error401BaseSchema } from "./schemas/error401";
import { error403Schema } from "./schemas/error403";
import { error400Schema } from "./schemas/error400";
import { shiftsContract } from "./shifts/shifts.contract";
import { error429Schema } from "./schemas/error429";

const c = initContract();

export const appContract = c.router(
	{
		auth: authContract,
		members: membersContract,
		roles: rolesContract,
		permissions: permissionsContract,
		shifts: shiftsContract,
	},
	{
		// Pour ceux qui se demandent, la difference entre 401 Unauthorized et 403 Forbidden :
		// 401, t'as pas la perm et le serveur te connais pas -> plus de token, mot de passe invalide
		// 403, t'as pas la perm et le serveur te connais -> email non valide, permission invalide
		commonResponses: {
			400: error400Schema,
			401: error401BaseSchema,
			403: error403Schema,
			429: error429Schema,
		},
	},
);
