import { createStore } from "solid-js/store";

type AuthState = { token: string | null };

const [auth, setAuth] = createStore<AuthState>({ token: null });

function setToken(token: string) {
	setAuth("token", token);
}

export const authActions = {
	login: setToken,
};

export { auth };
