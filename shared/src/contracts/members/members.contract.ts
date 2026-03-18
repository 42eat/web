import { initContract } from '@ts-rest/core'
import { MemberSchema } from './schemas/member.schema'

const c = initContract()

export const membersContract = c.router({
	profile: {
		method: 'GET',
		path: '/profile',
		responses: { 200: MemberSchema }
	}
}, { pathPrefix: '/members' })