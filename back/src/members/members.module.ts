import { Module } from "@nestjs/common";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";
import { RolesModule } from "../roles/roles.module";
import { LoggingModule } from "../core/logging/logging.module";

@Module({
	imports: [RolesModule, LoggingModule],
	providers: [MembersService],
	controllers: [MembersController],
	exports: [MembersService],
})
export class MembersModule {}
