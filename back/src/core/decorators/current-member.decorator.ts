import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface AuthMember {
	id: number;
	refreshToken?: string;
}

export const CurrentMember = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): AuthMember => {
		const request = ctx.switchToHttp().getRequest<{ user: AuthMember }>();
		return request.user;
	},
);
