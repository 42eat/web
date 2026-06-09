import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { EventsService } from "../events/events.service";

@Module({
	providers: [AppGateway, EventsService],
	exports: [EventsService],
})
export class GatewayModule {}
