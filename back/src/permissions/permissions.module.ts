import { Module } from "@nestjs/common";
import { PermissionsController } from "./permissions.controller";

@Module({
	imports: [],
	providers: [],
	controllers: [PermissionsController],
	exports: [],
})
export class PermissionsModule {}
