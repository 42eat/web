import { Module } from "@nestjs/common";
import { PrismaModule } from "../core/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MembersModule } from "src/members/members.module";
import { SessionsModule } from "src/sessions/sessions.module";

@Module({
  imports: [MembersModule, SessionsModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
