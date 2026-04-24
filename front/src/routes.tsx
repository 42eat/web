import { RouteDefinition, Router } from "@solidjs/router";
import AuthLayout from "./pages/auth/AuthLayout";
import LoginForm from "./pages/auth/LoginForm";
import Home from "./pages/Home";
import RegisterForm from "./pages/auth/RegisterForm";
import AuthGuard from "./components/guards/AuthGuard";
import Landing from "./pages/Landing";
import GuestGuard from "./components/guards/GuestGuard";
import VerifyEmail from "./pages/verifyEmail/ComfirmEmail";
import VerifiedEmailGuard from "./components/guards/VerifiedEmailGuard";

import PromptVerifyEmail from "./pages/verifyEmail/PromptVerifyEmail";
import UnverifiedEmailGuard from "./components/guards/UnverifiedEmailGuard";
import { emailConfirmationPath } from "@42eat-web/shared";

const routes = [
	{ path: "/", component: Landing },
	{
		path: "/",
		component: GuestGuard,
		children: [
			{
				path: "/auth",
				component: AuthLayout,
				children: [
					{ path: "/login", component: LoginForm },
					{ path: "/register", component: RegisterForm },
				],
			},
		],
	},
	{ path: emailConfirmationPath, component: VerifyEmail },
	{
		path: "/",
		component: AuthGuard,
		children: [
			{
				path: "/",
				component: UnverifiedEmailGuard,
				children: [
					{ path: "/verify-email", component: PromptVerifyEmail },
				],
			},
			{
				path: "/",
				component: VerifiedEmailGuard,
				children: [
					{ path: "/home", component: Home },
				],
			},
		],
	},
] as const satisfies RouteDefinition[];

export const AppRouter = () => {
	return <Router >{routes}</Router>;
};
