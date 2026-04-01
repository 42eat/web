import { initContract } from "@ts-rest/core";
import { authResponseSchema } from "./schemas/auth-response.schema";
import { loginSchema } from "./schemas/login.schema";
import { registerSchema } from "./schemas/register.schema";
import { confirmEmailSchema } from "./schemas/confirm-email.schema";
import { changePasswordSchema, requestPasswordResetSchema, resetPasswordSchema } from "./schemas/password.schema";

const c = initContract();

export const authContract = c.router(
	{
		register: {
			method: "POST",
			path: "/register",
			body: registerSchema,
			responses: { 200: authResponseSchema },
		},
		login: {
			method: "POST",
			path: "/login",
			body: loginSchema,
			responses: { 200: authResponseSchema },
		},
		refresh: {
			method: "POST",
			path: "/refresh",
			body: null,
			responses: { 200: authResponseSchema },
		},
		confirmEmail: {
			method: "POST",
			path: "/confirm-email",
			body: confirmEmailSchema,
			responses: { 204: null },
		},
		askNewConfirmationEmail: {
			method: "POST",
			path: "/new-confirm-email",
			body: null,
			responses: { 204: null },
		},
		changePassword: {
			method: "PATCH",
			path: "/password",
			body: changePasswordSchema,
			responses: { 204: null },
		},
		requestPasswordReset: {
			method: "POST",
			path: "/password/request-reset",
			body: requestPasswordResetSchema,
			responses: { 204: null },
		},
		resetPassword: {
			method: "POST",
			path: "/password/reset",
			body: resetPasswordSchema,
			responses: { 204: null },
		},
	},
	{ pathPrefix: "/auth" },
);
