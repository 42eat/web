import { jwtDecode } from "jwt-decode";
import { createSignal } from "solid-js";
import { doRefresh } from "~/api/doRefresh";
import { JwtPayload } from "@42eat-web/shared";
import { queryClient } from "~/App";
import { client, queryKeys } from "~/api/client";
import { createStore } from "solid-js/store";

export interface AuthenticatedState {
	accessToken: string;
	jwtPayload: JwtPayload;
}

export interface GuestState {
	accessToken: null;
}

export type AuthState = AuthenticatedState | GuestState;

const authChannel = new BroadcastChannel("auth");

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
	if ((auth.accessToken == null && accessToken)
		|| (auth.accessToken && accessToken == null)) {
		void queryClient.invalidateQueries({ queryKey: queryKeys.auth.getLogin42url() });
	}
	setAuth(authStateFromToken(accessToken));
	if (accessToken === null) {
		sessionStorage.removeItem("access-token");
	} else {
		sessionStorage.setItem("access-token", accessToken);
	}
	authChannel.postMessage(accessToken);
}

export const authActions = {
	setAccessToken,
	login: (accessToken: string) => setAccessToken(accessToken),
	logout: () => {
		void client.auth.logout.mutation().then(() => {
			setAccessToken(null);
			window.location.replace("/login");
		});
	},
	refreshToken: async () => setAccessToken(await doRefresh()),
} as const;


async function initialize() {
	const stored = sessionStorage.getItem("access-token");

	authChannel.addEventListener("message", (e: MessageEvent<string | null>) => {
		if (auth.accessToken === e.data) return;
		setAuth(authStateFromToken(e.data));
		if (e.data === null) window.location.replace("/login");
	});

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

function isLoggedIn() {
	return auth.accessToken != null;
}

export {
	auth,
	initialized,
	isLoggedIn,
};
