import { Module } from "@nestjs/common";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";
import { RolesModule } from "../roles/roles.module";

@Module({
	imports: [RolesModule],
	providers: [MembersService],
	controllers: [MembersController],
	exports: [MembersService],
})
export class MembersModule {}
