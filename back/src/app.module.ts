import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "./core/prisma/prisma.module";
import { MembersModule } from "./members/members.module";
import { AuthModule } from "./auth/auth.module";
import { SessionsModule } from "./sessions/sessions.module";
import { APP_GUARD } from "@nestjs/core";
import { PermissionGuard } from "./core/guards/permission.guard";
import { RolesModule } from "./roles/roles.module";
import { PermissionsModule } from "./permissions/permissions.module";

@Module({
	providers: [
		{
			provide: APP_GUARD,
			useClass: PermissionGuard,
		},
	],
	imports: [
		PrismaModule,
		MembersModule,
		AuthModule,
		RolesModule,
		SessionsModule,
		PermissionsModule,
		ScheduleModule.forRoot(),
	],
})
export class AppModule {}
