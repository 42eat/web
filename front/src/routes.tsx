import { Route, Router } from "@solidjs/router";
import AuthLayout from "./pages/auth/AuthLayout";
import LoginForm from "./pages/auth/LoginForm";
import Home from "./pages/Home";
import RegisterForm from "./pages/auth/RegisterForm";
import AuthGuard from "./components/guards/AuthGuard";
import Landing from "./pages/Landing";
import GuestGuard from "./components/guards/GuestGuard";
import VerifyEmail from "./pages/auth/verifyEmail/ComfirmEmail";
import VerifiedEmailGuard from "./components/guards/VerifiedEmailGuard";

import PromptVerifyEmail from "./pages/auth/verifyEmail/PromptVerifyEmail";
import UnverifiedEmailGuard from "./components/guards/UnverifiedEmailGuard";
import { emailConfirmationPath, passwordResetConfirmationPath } from "@42eat-web/shared";
import ResetPassword from "./pages/auth/passwordReset/ResetPassword";
import RequestPasswordReset from "./pages/auth/passwordReset/RequestPasswordReset";

export const AppRouter = () => {
	return <Router >
		<Route path="/" component={Landing} />
		<Route path="/" component={GuestGuard}>
			<Route path="/" component={AuthLayout}>
				<Route path="/login" component={LoginForm}/>
				<Route path="/register" component={RegisterForm} />
			</Route>
			<Route path="/auth/request-password-reset" component={RequestPasswordReset} />
		</Route>
		<Route path={emailConfirmationPath} component={VerifyEmail} />
		<Route path={passwordResetConfirmationPath} component={ResetPassword} />
		<Route path="/" component={AuthGuard}>
			<Route path="/" component={UnverifiedEmailGuard}>
				<Route path="/verify-email" component={PromptVerifyEmail}/>
			</Route>
			<Route path="/" component={VerifiedEmailGuard}>
				<Route path="/home" component={Home} />
			</Route>
		</Route>
	</Router>;
};
