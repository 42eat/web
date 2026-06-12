import { useNavigate, RouteSectionProps } from "@solidjs/router";
import { createContext, createEffect, Show, useContext } from "solid-js";
import { auth, AuthenticatedState } from "~/store/auth.store";

const AuthenticatedContext = createContext<AuthenticatedState>();

export function useAuth() {
	const ctx = useContext(AuthenticatedContext);
	if (!ctx) throw new Error("useAuth should only be used with AuthGuard parent.");
	return ctx;
}

export default function AuthGuard(props: RouteSectionProps) {
	const navigate = useNavigate();

	createEffect(() => {
		if (!auth.accessToken) navigate("/login", { replace: true });
	});

	return <Show when={auth.accessToken !== null && auth} keyed>
		{(auth) => <AuthenticatedContext.Provider value={auth}>
			{props.children}
		</AuthenticatedContext.Provider>}
	</Show>;
}
