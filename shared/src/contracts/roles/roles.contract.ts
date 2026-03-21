import { initContract } from '@ts-rest/core'
import { CreateRoleSchema, EditRoleSchema, RoleMembersResponseSchema, RoleResponseSchema, RolesListDetailedResponseSchema, RolesListResponseSchema } from './schemas/role.schema'
import { IdParamSchema } from '../schemas/common.schema'

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
}, { pathPrefix: '/roles' })


