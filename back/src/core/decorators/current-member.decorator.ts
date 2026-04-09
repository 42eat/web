import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UUID } from "crypto";

export interface AuthMember {
	id: number;
	emailValidated: boolean;
	jti?: UUID;
}

export const CurrentMember = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): AuthMember => {
		const request = ctx.switchToHttp().getRequest<{ user: AuthMember }>();
		return request.user;
	},
);
