import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { AuthResponseSchema } from './schemas/auth-response.schema'
import { LoginSchema } from './schemas/login.schema'
import { RegisterSchema } from './schemas/register.schema'
import { ConfirmEmailSchema } from './schemas/confirm-email.schema'

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
	},
	confirmEmail: {
		method: 'POST',
		path: '/confirm-email',
		body: ConfirmEmailSchema,
		responses: { 204: null  }
	},
	askNewConfirmationEmail: {
		method: 'POST',
		path: '/new-confirm-email',
		body: null,
		responses: { 204: null  }
	}
}, { pathPrefix: '/auth' })
