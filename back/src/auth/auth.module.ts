import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MembersModule } from "../members/members.module";
import { SessionsModule } from "../sessions/sessions.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshStrategy } from "./strategies/refresh.strategy";
import { MailModule } from "../core/mail/mail.module";
import { TokensModule } from "../tokens/tokens.module";
import { AppConfigModule } from "../config/config.controller";

@Module({
	imports: [MembersModule, SessionsModule, JwtModule, MailModule, TokensModule, AppConfigModule],
	providers: [AuthService, JwtStrategy, RefreshStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
