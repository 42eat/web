import { Module } from '@nestjs/common'
import { PrismaModule } from './core/prisma/prisma.module'
import { MembersModule } from './members/members.module'
import { AuthModule } from './auth/auth.module'
import { SessionsModule } from './sessions/sessions.module';

@Module({
	imports: [PrismaModule, MembersModule, AuthModule, SessionsModule],
})
export class AppModule {}
