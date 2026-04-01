import { Code401 } from "@42eat-web/shared";
import { UnauthorizedException } from "@nestjs/common";

export class AppUnauthorizedException extends UnauthorizedException {
	constructor(code: Code401, message?: string) {
		super({ message: message ?? "Unauthorized", code });
	}
}
