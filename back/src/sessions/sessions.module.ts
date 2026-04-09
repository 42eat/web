import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { LoggingModule } from "../core/logging/logging.module";

@Module({
	imports: [LoggingModule],
	providers: [SessionsService],
	controllers: [SessionsController],
	exports: [SessionsService],
})
export class SessionsModule {}
