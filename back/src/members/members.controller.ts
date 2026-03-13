// import { Controller } from '@nestjs/common';
// import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
// import { usersContract } from "@42eat-web/shared";
// import { UsersService } from './users.service';

// @Controller()
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @TsRestHandler(usersContract.getAll)
//   public async getAll() {
//     return tsRestHandler(usersContract.getAll, async () => {
//       const members = await this.usersService.getAll();
//       return { status: 200 as const, body: members };
//     });
//   }
// }


import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Member } from '../generated/prisma/client';
import { MembersService } from './members.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { type AuthMember, CurrentMember } from 'src/core/decorators/current-user.decorator';

@Controller('members')
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	@Get('all')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	public async getAll(): Promise<Member[]> {
		return this.membersService.getAll();
	}
	
	@Get('profile')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	public async getProfile(@CurrentMember() member: AuthMember): Promise<Member> {
		return this.membersService.getById(member.id);
	}
}
