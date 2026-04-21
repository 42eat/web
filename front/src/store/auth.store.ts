import { createStore } from "solid-js/store";
import { jwtDecode } from "jwt-decode";
import { createSignal } from "solid-js";
import { doRefresh } from "~/api/doRefresh";

/**
 * @ts-expect-error Temp code only until type is exposed in shared workspace
 */
interface JwtPayload {
	sub: number;
	emailVerified: boolean;
}

type AuthState = {
	accessToken: string;
	jwtPayload: JwtPayload;
} | {
	accessToken: null;
};

const [initialized, setInitialized] = createSignal(false);

function authStateFromToken(accessToken: string | null): AuthState {
	if (accessToken === null) return { accessToken: null };
	const jwtPayload = jwtDecode<JwtPayload>(accessToken);
	return {
		accessToken: accessToken,
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
	login(accessToken: string) {
		setAccessToken(accessToken);
		sessionStorage.setItem("access-token", accessToken);
	},
	logout() {
		setAccessToken(null);
		sessionStorage.removeItem("access-token");
	},
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

/** It's too late to comment. If you don't understand, trust :) */
void initialize();

export { auth, initialized };
