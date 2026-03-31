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
import { MailModule } from "./core/mail/mail.module";
import { TokensService } from './tokens/tokens.service';
import { TokensModule } from './tokens/tokens.module';

@Module({
	providers: [
		{
			provide: APP_GUARD,
			useClass: PermissionGuard,
		},
		TokensService,
	],
	imports: [
		PrismaModule,
		MembersModule,
		AuthModule,
		RolesModule,
		SessionsModule,
		PermissionsModule,
		MailModule,
		ScheduleModule.forRoot(),
		TokensModule,
	],
})
export class AppModule {}
