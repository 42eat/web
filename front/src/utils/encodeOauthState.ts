export interface FrontState {
	backState: string;
	authTarget: string | null;
}

export function encodeOauthState(state: FrontState) {
	return encodeURIComponent(btoa(JSON.stringify(state)));
}

export function decodeOauthState(encodedState: string): FrontState {
	try {
		return JSON.parse(atob(decodeURIComponent(encodedState))) as FrontState;
	} catch (_) {
		return {
			backState: encodedState,
			authTarget: null,
		};
	}
}
