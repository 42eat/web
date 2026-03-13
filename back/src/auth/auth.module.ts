import { Module } from "@nestjs/common";
import { PrismaModule } from "../core/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MembersModule } from "src/members/members.module";
import { SessionsModule } from "src/sessions/sessions.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshStrategy } from "./strategies/refresh.strategy";

@Module({
  imports: [MembersModule, SessionsModule, JwtModule],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
