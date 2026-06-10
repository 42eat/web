import { Module } from "@nestjs/common";
import { FoyerService } from "./foyer.service";
import { FoyerController } from "./foyer.controller";
import { LoggingModule } from "../core/logging/logging.module";
import { AppConfigModule } from "../config/config.controller";
import { GatewayModule } from "../gateway/gateway.module";

@Module({
	imports: [LoggingModule, AppConfigModule, GatewayModule],
	providers: [FoyerService],
	controllers: [FoyerController],
	exports: [FoyerService],
})
export class FoyerModule {}
