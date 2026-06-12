import { Controller } from "@nestjs/common";
import { AppConfigService } from "./config.service";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { appConfigContract, getAppVariables, PERMISSIONS } from "@42eat-web/shared";
import { RequirePermission } from "../core/decorators/require-permission.decorator";

@Controller()
export class AppConfigController {
	constructor(private readonly appConfigService: AppConfigService) {}

	@RequirePermission(PERMISSIONS.APP_CONFIG.LIST)
	@TsRestHandler(appConfigContract.getVariables)
	public getVariables() {
		return tsRestHandler(appConfigContract.getVariables, async () => {
			const variables = await this.appConfigService.getVariables();
			return { status: 200, body: getAppVariables.parse(variables) };
		});
	}

	@RequirePermission(PERMISSIONS.APP_CONFIG.EDIT)
	@TsRestHandler(appConfigContract.editVariable)
	public editVariable() {
		return tsRestHandler(appConfigContract.editVariable, async ({ params, body }) => {
			await this.appConfigService.editVariables(params.key, body.value);
			return { status: 204, body: null };
		});
	}
}
