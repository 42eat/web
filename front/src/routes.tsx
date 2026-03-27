import { Route, Router } from "@solidjs/router";
import { Component } from "solid-js";
import AuthLayout from "./pages/auth/AuthLayout";
import LoginForm from "./pages/auth/LoginForm";
import Home from "./pages/Home";
import RegisterForm from "./pages/auth/RegisterForm";
import AuthGuard from "./components/guards/AuthGuard";
import Landing from "./pages/Landing/Landing";
import GuestGuard from "./components/guards/GuestGuard";

export const AppRouter: Component = () => {
	return <Router>
		<Route path="/" component={Landing} />
		<Route path="/" component={GuestGuard}>
			<Route path="/auth" component={AuthLayout}>
				<Route path="/login" component={LoginForm} />
				<Route path="/register" component={RegisterForm} />
			</Route>
		</Route>
		<Route path="/" component={AuthGuard}>
			<Route path="/home" component={Home} />
		</Route>
	</Router>;
}
