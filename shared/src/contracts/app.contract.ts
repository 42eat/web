import { initContract } from "@ts-rest/core";
import { authContract } from "./auth/auth.contract";
import { membersContract } from "./members/members.contract";
import { rolesContract } from "./roles/roles.contract";
import { permissionsContract } from "./permissions/permissions.contract";
import { Error401Schema } from "./schemas/error401";
import { Error403Schema } from "./schemas/error403";

const c = initContract();

export const appContract = c.router(
	{
		auth: authContract,
		members: membersContract,
		roles: rolesContract,
		permissions: permissionsContract,
	},
	{
		// Pour ceux qui se demandent, la difference entre 401 Unauthorized et 403 Forbidden :
		// 401, t'as pas la perm et le serveur te connais pas -> plus de token, mot de passe invalide
		// 403, t'as pas la perm et le serveur te connais -> email non valide, permission invalide
		commonResponses: {
			401: Error401Schema,
			403: Error403Schema,
		},
	},
);
