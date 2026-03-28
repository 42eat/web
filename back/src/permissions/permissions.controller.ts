import { Controller } from "@nestjs/common";
import { permissionsContract } from "@42eat-web/shared";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { PERMISSIONS } from "@42eat-web/shared";

@Controller()
export class PermissionsController {
	constructor() {}

	@TsRestHandler(permissionsContract.getPermissionList)
	@RequirePermission(PERMISSIONS.PERMISSIONS.LIST)
	public profile() {
		return tsRestHandler(permissionsContract.getPermissionList, () => {
			return Promise.resolve({ status: 200, body: PERMISSIONS });
		});
	}
}
