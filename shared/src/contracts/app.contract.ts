import { initContract } from '@ts-rest/core'
import { authContract } from './auth/auth.contract'
// import { membersContract } from './members/members.contract'
// import { sessionsContract } from './sessions/sessions.contract'

const c = initContract()

export const appContract = c.router({
	auth: authContract,
	// members: membersContract,
	// sessions: sessionsContract,
})