export { appContract } from "./contracts/app.contract";
export { authContract } from "./contracts/auth/auth.contract";
export { membersContract } from "./contracts/members/members.contract";
export { rolesContract } from "./contracts/roles/roles.contract";
export { permissionsContract } from "./contracts/permissions/permissions.contract";
export { shiftsContract } from "./contracts/shifts/shifts.contract";

export { loginSchema, type LoginDto } from "./contracts/auth/schemas/login.schema";
export { registerSchema, type RegisterDto } from "./contracts/auth/schemas/register.schema";
export { resetPasswordSchema, changePasswordSchema, type RequestPasswordResetDto, type ChangePasswordDto } from "./contracts/auth/schemas/password.schema";
export { memberSchema, profileSchema } from "./contracts/members/schemas/member.schema";
export { createRoleSchema, roleMembersResponseSchema, roleResponseSchema, rolesListDetailedResponseSchema, rolesListResponseSchema } from "./contracts/roles/schemas/role.schema";
export { shiftPositionSchema, shiftPositionsSchema, createShiftPositionSchema, editShiftPositionSchema } from "./contracts/shifts/schemas/shift-positions.schema";
export { shiftTypeSchema, shiftTypesSchema, createShiftTypeSchema, editShiftTypeSchema } from "./contracts/shifts/schemas/shift-types.schema";
export { shiftSchema, shiftsSchema, createShiftSchema, editShiftSchema, type ShiftResponse, type CreateShiftDto, type EditShiftDto, type AddShiftMemberDto, shiftWithoutCanEditSchema, type ShiftWithoutCanEdit } from "./contracts/shifts/schemas/shifts.schema";
export { statusSchema, setStatusSchema } from "./contracts/foyer/schemas/foyer.schema";
export { foyerContract } from "./contracts/foyer/foyer.contract";

export { error401Schema } from "./contracts/schemas/error401";


export { emailConfirmationPath, passwordResetConfirmationPath } from "./core/constants";
export { createJwtPayload, type JwtPayload } from "./core/jwt.payload";
export { PERMISSIONS } from "./core/permissions";
export { type Permission } from "./core/permissions";

export { type Code401, code401 } from "./contracts/schemas/error401";
export { type Code403, code403 } from "./contracts/schemas/error403";

// export { w } from "./websocket/builder";
// export { type SC } from "./websocket/contract";
export { ws } from "./websocket/contracts";
export { type WSEvent, type EventRouter, isEvent } from "./websocket/event-builder";
export { type RoomRouter, isRoom } from "./websocket/builder";
