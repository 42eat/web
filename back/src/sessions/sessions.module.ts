import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";

@Module({
	providers: [SessionsService],
	controllers: [SessionsController],
	exports: [SessionsService],
})
export class SessionsModule {}
