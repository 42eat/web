import { Module } from "@nestjs/common";
import { ShiftsController } from "./shifts.controller";
import { ShiftsService } from "./shifts.service";
import { ShiftPositionService } from "./shift-position.service";
import { ShiftsPositionController } from "./shift-position.controller";

@Module({
	controllers: [ShiftsController, ShiftsPositionController],
	providers: [ShiftsService, ShiftPositionService],
})
export class ShiftsModule {}
