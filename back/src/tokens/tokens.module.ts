import { Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { LoggingModule } from "../core/logging/logging.module";

@Module({
	imports: [LoggingModule],
	providers: [TokensService],
	exports: [TokensService],
})
export class TokensModule {}
