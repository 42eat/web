
export class LogBuilder {
	static auth = {
		registration: (email: string, memberId?: number) => ({
			action: "AUTH_REGISTRATION",
			email,
			memberId,
		}),
		registrationFailed: (email: string, reason: string) => ({
			action: "AUTH_REGISTRATION_FAILED",
			email,
			reason,
		}),
		login: (email: string, memberId: number) => ({
			action: "AUTH_LOGIN",
			email,
			memberId,
		}),
		loginFailed: (email: string, reason: string) => ({
			action: "AUTH_LOGIN_FAILED",
			email,
			reason,
		}),
		logout: (memberId: number) => ({
			action: "AUTH_LOGOUT",
			memberId,
		}),
		passwordChanged: (memberId: number) => ({
			action: "PASSWORD_CHANGED",
			memberId,
		}),
		passwordResetRequested: (email: string) => ({
			action: "PASSWORD_RESET_REQUESTED",
			email,
		}),
	};

	static mail = {
		send: (email: string[], template: string) => ({
			action: "SEND_EMAIL",
			email,
			template,
		}),
	};

	static session = {
		cleanupCompleted: (deletedCount: number) => ({
			action: "SESSIONS_CLEANUP_COMPLETED",
			deletedCount,
		}),
	};

	static token = {
		created: (purpose: string, memberId?: number) => ({
			action: "TOKEN_CREATED",
			purpose,
			memberId,
		}),
		validated: (purpose: string, memberId?: number) => ({
			action: "TOKEN_VALIDATED",
			purpose,
			memberId,
		}),
		validationFailed: (purpose: string, reason: string) => ({
			action: "TOKEN_VALIDATION_FAILED",
			purpose,
			reason,
		}),
		cleanupCompleted: (deletedCount: number) => ({
			action: "TOKENS_CLEANUP_COMPLETED",
			deletedCount,
		}),
	};

	static member = {
		unverifiedCleaned: (deletedCount: number) => ({
			action: "UNVERIFIED_MEMBERS_CLEANUP",
			deletedCount,
		}),
	};

	static error = (action: string, message: string, details?: Record<string, unknown>) => ({
		action: `${action}_ERROR`,
		message,
		details,
	});
}
