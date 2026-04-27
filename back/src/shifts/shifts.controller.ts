import { Controller } from "@nestjs/common";
import { ShiftsService } from "./shifts.service";
import { PERMISSIONS, shiftsContract, shiftsSchema } from "@42eat-web/shared";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { shiftSchema } from "@42eat-web/shared";
import { AuthMember, CurrentMember } from "../core/decorators/current-member.decorator";

@Controller()
export class ShiftsController {
	constructor(private readonly shifts: ShiftsService) {}

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

	@TsRestHandler(shiftsContract.createShift)
	@RequirePermission(PERMISSIONS.SHIFT.CREATE_SHIFT)
	public createShift(@CurrentMember() authMember: AuthMember) {
		return tsRestHandler(shiftsContract.createShift, async ({ body }) => {
			const shift = await this.shifts.createShift(body, authMember.id);
			return { status: 200, body: shiftSchema.parse(shift) };
		});
	}

	@TsRestHandler(shiftsContract.editShift)
	@RequirePermission(PERMISSIONS.SHIFT.EDIT_SHIFT)
	public editShift(@CurrentMember() authMember: AuthMember) {
		return tsRestHandler(shiftsContract.editShift, async ({ body, params }) => {
			const shift = await this.shifts.editShift(params.id, body, authMember.id);
			return { status: 200, body: shiftSchema.parse(shift) };
		});
	}

	@TsRestHandler(shiftsContract.addShiftMember)
	@RequirePermission(PERMISSIONS.SHIFT.EDIT_SHIFT)
	public addShiftMember(@CurrentMember() authMember: AuthMember) {
		return tsRestHandler(shiftsContract.addShiftMember, async ({ body, params }) => {
			await this.shifts.addShiftMember(params.id, body, authMember.id);
			return { status: 204, body: null };
		});
	}

	@TsRestHandler(shiftsContract.deleteShiftMember)
	@RequirePermission(PERMISSIONS.SHIFT.EDIT_SHIFT)
	public deleteShiftMember(@CurrentMember() authMember: AuthMember) {
		return tsRestHandler(shiftsContract.deleteShiftMember, async ({ params }) => {
			await this.shifts.deleteShiftMember(params.id, params.memberId, authMember.id);
			return { status: 204, body: null };
		});
	}
}
