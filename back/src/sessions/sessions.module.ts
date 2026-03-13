import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { PrismaModule } from "../core/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	providers: [SessionsService],
	controllers: [SessionsController],
	exports: [SessionsService],
})
export class SessionsModule {}
