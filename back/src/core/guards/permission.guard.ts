import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequirePermission } from "../decorators/require-permission.decorator";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthMember } from "../decorators/current-member.decorator";
import { MembersService } from "../../members/members.service";
import { AppUnauthorizedException } from "../error/unauthorized";

@Injectable()
export class PermissionGuard extends JwtAuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly members: MembersService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const permission = this.reflector.get(
			RequirePermission,
			context.getHandler(),
		);
		if (!permission) {
			return true;
		}
		await super.canActivate(context);

		const request = context.switchToHttp().getRequest<{ user: AuthMember }>();
		const user: AuthMember = request.user;

		// console.log(user);
		// console.log(permission);

		if (await this.members.doMemberHavePermission(user.id, permission)) {
			return true;
		}

		throw new AppUnauthorizedException(
			"INVALID_PERMISSION",
			"You don't have the required permission for this route",
		);
	}
}
