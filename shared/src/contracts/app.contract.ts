import { initContract } from '@ts-rest/core'
import { authContract } from './auth/auth.contract'
import { membersContract } from './members/members.contract'
import { rolesContract } from './roles/roles.contract'

const c = initContract()

export const appContract = c.router({
	auth: authContract,
	members: membersContract,
	roles: rolesContract,
})