import { Controller } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { ShiftPositionService } from "./shift-positions.service";
import { PERMISSIONS, shiftsContract } from "@42eat-web/shared";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { shiftPositionSchema, shiftPositionsSchema } from "@42eat-web/shared";

@Controller()
export class ShiftsPositionController {
	constructor(private readonly shiftPosition: ShiftPositionService) {}

	@TsRestHandler(shiftsContract.positions.getPositions)
	@RequirePermission(PERMISSIONS.SHIFT.GET_POSITIONS)
	public getPositions() {
		return tsRestHandler(shiftsContract.positions.getPositions, async () => {
			const result = await this.shiftPosition.getPositions();
			return { status: 200, body: shiftPositionsSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.positions.getPosition)
	@RequirePermission(PERMISSIONS.SHIFT.GET_POSITION)
	public getPosition() {
		return tsRestHandler(shiftsContract.positions.getPosition, async ({ params }) => {
			const result = await this.shiftPosition.getPosition(params.id);
			return { status: 200, body: shiftPositionSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.positions.createPosition)
	@RequirePermission(PERMISSIONS.SHIFT.CREATE_POSITION)
	public createPosition() {
		return tsRestHandler(shiftsContract.positions.createPosition, async ({ body }) => {
			const result = await this.shiftPosition.createPosition(body.position, body.xpMult);
			return { status: 200, body: shiftPositionSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.positions.editPosition)
	@RequirePermission(PERMISSIONS.SHIFT.EDIT_POSITION)
	public editPosition() {
		return tsRestHandler(shiftsContract.positions.editPosition, async ({ params, body }) => {
			const result = await this.shiftPosition.editPosition(params.id, body.position, body.xpMult);
			return { status: 200, body: shiftPositionSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.positions.deletePosition)
	@RequirePermission(PERMISSIONS.SHIFT.DELETE_POSITION)
	public deletePosition() {
		return tsRestHandler(shiftsContract.positions.deletePosition, async ({ params }) => {
			await this.shiftPosition.deletePosition(params.id);
			return { status: 204, body: null };
		});
	}

}
