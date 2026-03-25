import { Module } from "@nestjs/common";
import { PrismaModule } from "../core/prisma/prisma.module";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";
import { RolesModule } from "../roles/roles.module";

@Module({
	imports: [PrismaModule, RolesModule],
	providers: [MembersService],
	controllers: [MembersController],
	exports: [MembersService],
})
export class MembersModule {}
