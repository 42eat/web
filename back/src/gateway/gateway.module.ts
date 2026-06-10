import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { EventsService } from "../events/events.service";
import { MembersModule } from "../members/members.module";
import { JwtModule } from "@nestjs/jwt";
import { SocketAuthService } from "./socket-auth.service";

@Module({
	imports: [MembersModule, JwtModule],
	providers: [AppGateway, EventsService, SocketAuthService],
	exports: [EventsService],
})
export class GatewayModule {}
