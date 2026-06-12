import { Module } from "@nestjs/common";
import { AppConfigService } from "./config.service";
import { AppConfigController } from "./config.controller";

@Module({
	providers: [AppConfigService],
	controllers: [AppConfigController],
	exports: [AppConfigService],
})
export class AppConfigModule {}
