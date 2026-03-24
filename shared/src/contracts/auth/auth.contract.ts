import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { AuthResponseSchema } from './schemas/auth-response.schema'
import { LoginSchema } from './schemas/login.schema'
import { RegisterSchema } from './schemas/register.schema'
import { Error403Schema } from '../schemas/error403'

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
		responses: { 200: AuthResponseSchema  }
	},
	refresh: {
		method: 'POST',
		path: '/refresh',
		body: null,
		responses: { 200: AuthResponseSchema  }
	}
}, { pathPrefix: '/auth' })