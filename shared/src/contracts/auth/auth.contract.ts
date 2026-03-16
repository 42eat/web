import { initContract } from '@ts-rest/core'
import { AuthResponseSchema } from './schemas/auth-response.schema'
import { LoginSchema } from './schemas/login.schema'
import { RegisterSchema } from './schemas/register.schema'

const c = initContract()

export const authContract = c.router({
	register: {
		method: 'POST',
		path: '/register',
		body: RegisterSchema,
		responses: { 200: AuthResponseSchema }
	},
	login: {
		method: 'POST',
		path: '/login',
		body: LoginSchema,
		responses: { 200: AuthResponseSchema }
	},
	refresh: {
		method: 'POST',
		path: '/refresh',
		body: c.noBody(),
		responses: { 200: AuthResponseSchema }
	}
}, { pathPrefix: '/auth' })