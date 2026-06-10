import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { EventService } from "../events/event.service";
import { MembersModule } from "../members/members.module";
import { JwtModule } from "@nestjs/jwt";
import { SocketAuthService } from "./socket-auth.service";

@Module({
	imports: [MembersModule, JwtModule],
	providers: [AppGateway, EventService, SocketAuthService],
	exports: [EventService],
})
export class GatewayModule {}
