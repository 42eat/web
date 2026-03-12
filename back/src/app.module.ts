import { Module } from '@nestjs/common'
import { PrismaModule } from './core/prisma/prisma.module'
import { MembersModule } from './members/members.module'
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [PrismaModule, MembersModule, AuthModule],
})
export class AppModule {}
