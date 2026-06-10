import { Controller } from "@nestjs/common";
import { foyerContract } from "@42eat-web/shared";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AppConfigService } from "../config/config.service";
import { EventService } from "../events/event.service";

@Controller()
export class FoyerController {
	constructor(
		private readonly appConfigService: AppConfigService,
		private readonly eventService: EventService,
	) {}

	@TsRestHandler(foyerContract.getStatus)
	public getStatus() {
		return tsRestHandler(foyerContract.getStatus, async () => {
			const foyerOpen = await this.appConfigService.get("foyer-open");
			if (foyerOpen && foyerOpen === "true") {
				return { status: 200, body: { open: true } };
			} else {
				return { status: 200, body: { open: false } };
			}
		});
	}

	@TsRestHandler(foyerContract.setStatus)
	public setStatus() {
		return tsRestHandler(foyerContract.setStatus, async ({ body }) => {
			await this.appConfigService.set("foyer-open", body.open.toString());
			this.eventService.emitFoyerOpenStatus(body.open);
			return { status: 204, body: null };
		});
	}
}
