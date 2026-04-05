import { initContract } from "@ts-rest/core";
import { authResponseSchema } from "./schemas/auth-response.schema";
import { loginSchema } from "./schemas/login.schema";
import { registerSchema } from "./schemas/register.schema";
import { confirmEmailSchema } from "./schemas/confirm-email.schema";
import { changePasswordSchema, requestPasswordResetSchema, resetPasswordSchema } from "./schemas/password.schema";
import { requestEmailResetSchema, resetEmailSchema } from "./schemas/email.schema";
import { auth42Schema } from "./schemas/42login.schema";

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
		logout: {
			method: "POST",
			path: "/logout",
			body: null,
			responses: { 204: null },
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
		requestEmailReset: {
			method: "POST",
			path: "/email/request-reset",
			body: requestEmailResetSchema,
			responses: { 204: null },
		},
		resetEmail: {
			method: "POST",
			path: "/email/reset",
			body: resetEmailSchema,
			responses: { 204: null },
		},
		getLogin42url: {
			method: "GET",
			path: "/42",
			responses: { 302: null },
		},
		auth42: {
			method: "POST",
			path: "/42/auth",
			body: auth42Schema,
			responses: { 200: authResponseSchema },
		},
	},
	{ pathPrefix: "/auth" },
);
