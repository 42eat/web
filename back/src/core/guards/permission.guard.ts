import {
	Injectable,
	CanActivate,
	ExecutionContext,
	// UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequirePermission } from "../decorators/require-permission.decorator";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { AuthMember } from "../decorators/current-member.decorator";

@Injectable()
export class PermissionGuard extends JwtAuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {
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

		console.log(user);

		// throw new UnauthorizedException("T'as pas la perm fdp");

		// verif dans la db si l'user lié a user.id a la perm et throw si c'est pas le cas
		return true;
	}
}
