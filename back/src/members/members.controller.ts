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

import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	UseGuards,
} from "@nestjs/common";
import { MembersService } from "./members.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
	type AuthMember,
	CurrentMember,
} from "../core/decorators/current-user.decorator";
import { plainToInstance } from "class-transformer";
import { ProfileResponse } from "./response/profile.response";
import { ApiResponse } from "@nestjs/swagger";

@Controller("members")
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	@Get("all")
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	public async getAll() {
		return this.membersService.getAll();
	}

	@Get("profile")
	@ApiResponse({ type: ProfileResponse })
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	public async getProfile(@CurrentMember() member: AuthMember) {
		return plainToInstance(
			ProfileResponse,
			this.membersService.getById(member.id),
		);
	}
}
