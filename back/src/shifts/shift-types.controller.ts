import { Controller } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { ShiftTypeService } from "./shift-types.service";
import { PERMISSIONS, shiftsContract } from "@42eat-web/shared";
import { RequirePermission } from "../core/decorators/require-permission.decorator";
import { shiftTypeSchema, shiftTypesSchema } from "@42eat-web/shared";

@Controller()
export class ShiftsTypeController {
	constructor(private readonly shiftType: ShiftTypeService) {}

	@TsRestHandler(shiftsContract.types.getTypes)
	@RequirePermission(PERMISSIONS.SHIFT.GET_TYPES)
	public getTypes() {
		return tsRestHandler(shiftsContract.types.getTypes, async () => {
			const result = await this.shiftType.getTypes();
			return { status: 200, body: shiftTypesSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.types.getType)
	@RequirePermission(PERMISSIONS.SHIFT.GET_TYPE)
	public getType() {
		return tsRestHandler(shiftsContract.types.getType, async ({ params }) => {
			const result = await this.shiftType.getType(params.id);
			return { status: 200, body: shiftTypeSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.types.createType)
	@RequirePermission(PERMISSIONS.SHIFT.CREATE_TYPE)
	public createType() {
		return tsRestHandler(shiftsContract.types.createType, async ({ body }) => {
			const result = await this.shiftType.createType(body.type, body.xpMult);
			return { status: 200, body: shiftTypeSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.types.editType)
	@RequirePermission(PERMISSIONS.SHIFT.EDIT_TYPE)
	public editType() {
		return tsRestHandler(shiftsContract.types.editType, async ({ params, body }) => {
			const result = await this.shiftType.editType(params.id, body.type, body.xpMult);
			return { status: 200, body: shiftTypeSchema.parse(result) };
		});
	}

	@TsRestHandler(shiftsContract.types.deleteType)
	@RequirePermission(PERMISSIONS.SHIFT.DELETE_TYPE)
	public deleteType() {
		return tsRestHandler(shiftsContract.types.deleteType, async ({ params }) => {
			await this.shiftType.deleteType(params.id);
			return { status: 204, body: null };
		});
	}

}
