import { Module } from "@nestjs/common";
import { ShiftsController } from "./shifts.controller";
import { ShiftsService } from "./shifts.service";
import { ShiftPositionService } from "./shift-positions.service";
import { ShiftsPositionController } from "./shift-positions.controller";
import { ShiftsTypeController } from "./shift-types.controller";
import { ShiftTypeService } from "./shift-types.service";
import { MembersModule } from "../members/members.module";

@Module({
	imports: [ MembersModule ],
	controllers: [ShiftsPositionController, ShiftsTypeController, ShiftsController],
	providers: [ShiftsService, ShiftPositionService, ShiftTypeService],
})
export class ShiftsModule {}
