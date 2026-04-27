import { Controller } from "@nestjs/common";
import { ShiftsService } from "./shifts.service";
import { PERMISSIONS, shiftsContract, shiftsSchema } from "@42eat-web/shared";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { shiftSchema } from "@42eat-web/shared";

@Controller()
export class ShiftsController {
	constructor(private readonly shifts: ShiftsService) {}

	@TsRestHandler(shiftsContract.createShift)
	@RequirePermission(PERMISSIONS.SHIFT.CREATE_SHIFT)
	public createShift() {
		return tsRestHandler(shiftsContract.createShift, async ({ body }) => {
			const shift = await this.shifts.createShift(body);
			return { status: 200, body: shiftSchema.parse(shift) };
		});
	}

	@TsRestHandler(shiftsContract.getShift)
	@RequirePermission(PERMISSIONS.SHIFT.GET_SHIFT)
	public getShift() {
		return tsRestHandler(shiftsContract.getShift, async ({ params }) => {
			const shift = await this.shifts.getShift(params.id);
			return { status: 200, body: shiftSchema.parse(shift) };
		});
	}

	@TsRestHandler(shiftsContract.getShifts)
	@RequirePermission(PERMISSIONS.SHIFT.GET_SHIFTS)
	public getShifts() {
		return tsRestHandler(shiftsContract.getShifts, async () => {
			const shifts = await this.shifts.getShifts();
			return { status: 200, body: shiftsSchema.parse(shifts) };
		});
	}
}
