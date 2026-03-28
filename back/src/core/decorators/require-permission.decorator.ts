import { Permission } from "@42eat-web/shared";
import { Reflector } from "@nestjs/core";

export const RequirePermission = Reflector.createDecorator<Permission>();
