import { initContract } from '@ts-rest/core'
import { CreateRoleSchema, EditRoleSchema, PermissionListSchema, RoleMembersResponseSchema, RoleResponseSchema, RolesListDetailedResponseSchema, RolesListResponseSchema } from './schemas/role.schema'
import { IdParamSchema } from '../schemas/common.schema'
import { Error403Schema } from '../schemas/error403'

const c = initContract()

export const rolesContract = c.router({
	createRole: {
		method: 'POST',
		path: '/',
		body: CreateRoleSchema,
		responses: { 204: null }
	},
	listRolesDetailed: {
		method: 'GET',
		path: '/detailed',
		responses: { 200: RolesListDetailedResponseSchema }
	},
	editRole: {
		method: 'PATCH',
		path: '/:id',
		pathParams: IdParamSchema,
		body: EditRoleSchema,
		responses: { 204: null }
	},
	deleteRole: {
		method: 'DELETE',
		path: '/:id',
		pathParams: IdParamSchema,
		responses: { 204: null }
	},
	getRole: {
		method: 'GET',
		path: '/:id',
		pathParams: IdParamSchema,
		responses: { 200: RoleResponseSchema }
	},
	listRoles: {
		method: 'GET',
		path: '/',
		responses: { 200: RolesListResponseSchema }
	},
	getRoleMembers: {
		method: 'GET',
		path: '/:id/members',
		pathParams: IdParamSchema,
		responses: { 200: RoleMembersResponseSchema }
	},
	addRolePermissions: {
		method: 'POST',
		path: '/:id/permissions',
		body: PermissionListSchema,
		pathParams: IdParamSchema,
		responses: { 204: null }
	},
	removeRolePermissions: {
		method: 'DELETE',
		path: '/:id/permissions',
		body: PermissionListSchema,
		pathParams: IdParamSchema,
		responses: { 204: null }
	},
	setRolePermissions: {
		method: 'PUT',
		path: '/:id/permissions',
		body: PermissionListSchema,
		pathParams: IdParamSchema,
		responses: { 204: null }
	},
}, { pathPrefix: '/roles' })


