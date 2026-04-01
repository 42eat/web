import { Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { PrismaModule } from "../core/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	providers: [TokensService],
	exports: [TokensService],
})
export class TokensModule {}
