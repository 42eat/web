import { initContract } from '@ts-rest/core'
import { PERMISSIONS } from '../../core/permissions'
import { PermissionsResponseSchema } from './schemas/permission.schema'
import { Error403Schema } from '../schemas/error403'

const c = initContract()

export const permissionsContract = c.router({
	getPermissionList: {
		method: 'GET',
		path: '/',
		responses: { 200: PermissionsResponseSchema }
	},
}, { pathPrefix: '/permissions' })


