import { Module } from "@nestjs/common";
import { PrismaModule } from "../core/prisma/prisma.module";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";

@Module({
	imports: [PrismaModule],
	providers: [MembersService],
	controllers: [MembersController],
	exports: [MembersService]
})
export class MembersModule {}
