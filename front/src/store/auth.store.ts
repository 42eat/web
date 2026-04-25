import { createStore } from "solid-js/store";
import { jwtDecode } from "jwt-decode";
import { createSignal } from "solid-js";
import { doRefresh } from "~/api/doRefresh";
import { JwtPayload } from "@42eat-web/shared";

export interface AuthenticatedState {
	accessToken: string;
	jwtPayload: JwtPayload;
}

export interface GuestState {
	accessToken: null;
}

export type AuthState = AuthenticatedState | GuestState;

const [initialized, setInitialized] = createSignal(false);

function authStateFromToken(accessToken: string | null): AuthState {
	if (accessToken === null) return { accessToken: null };
	const jwtPayload = jwtDecode<JwtPayload>(accessToken);
	return {
		accessToken,
		jwtPayload,
	};
}

const [auth, setAuth] = createStore<AuthState>(authStateFromToken(null));

function setAccessToken(accessToken: string | null) {
	setAuth(authStateFromToken(accessToken));
	if (accessToken === null) {
		sessionStorage.removeItem("access-token");
	} else {
		sessionStorage.setItem("access-token", accessToken);
	}
}

export const authActions = {
	setAccessToken,
	login: (accessToken: string) => setAccessToken(accessToken),
	logout: () => setAccessToken(null),
	refreshToken: async () => setAccessToken(await doRefresh()),
} as const;


async function initialize() {
	const stored = sessionStorage.getItem("access-token");

	if (stored) {
		setAuth(authStateFromToken(stored));
		setInitialized(true);
		return;
	}

	try {
		const accessToken = await doRefresh();
		if (accessToken !== null) setAuth(authStateFromToken(accessToken));
	} catch {}

	setInitialized(true);
}

/** `void` in js will ignore the return value of the following function.
	* It's mostly used to only silence warnings by providing a exhaustive
	* way to ignore return values of a function
	* (every function doesn't need void to ignore return values, but in
	* our case ignored `Promises` create warnings)*/
void initialize();

export { auth, initialized };
