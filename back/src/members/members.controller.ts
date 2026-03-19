import { Controller, UseGuards } from "@nestjs/common";
import { MembersService } from "./members.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
	type AuthMember,
	CurrentMember,
} from "../core/decorators/current-user.decorator";
import { MemberSchema, membersContract } from "@42eat-web/shared";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";

@Controller()
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	// @Get("all")
	// @UseGuards(JwtAuthGuard)
	// @HttpCode(HttpStatus.OK)
	// public async getAll() {
	// 	return this.membersService.getAll();
	// }

	@TsRestHandler(membersContract.profile)
	@UseGuards(JwtAuthGuard)
	public async profile(@CurrentMember() authMember: AuthMember) {
		return tsRestHandler(membersContract.profile, async () => {
			const member = await this.membersService.getById(authMember.id);
			return { status: 200, body: MemberSchema.parse(member) };
		});
	}
}
