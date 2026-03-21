export { appContract } from './contracts/app.contract'
export { authContract } from './contracts/auth/auth.contract'
export { membersContract } from './contracts/members/members.contract'
export { rolesContract } from './contracts/roles/roles.contract'

export { LoginSchema, type LoginDto } from './contracts/auth/schemas/login.schema'
export { RegisterSchema, type RegisterDto } from './contracts/auth/schemas/register.schema'
export { MemberSchema, type MemberDto } from './contracts/members/schemas/member.schema'
export {
	CreateRoleSchema, type CreateRoleDto,
	RoleMembersResponseSchema,
	RoleResponseSchema,
	RolesListDetailedResponseSchema,
	RolesListResponseSchema
} from './contracts/roles/schemas/role.schema'

export { PERMISSIONS } from './core/permissions'
export { type Permission } from './core/permissions'