import z from "zod";

const frontStateSchema = z.object({
	backState: z.string(),
	authTarget: z.string().nullable(),
});

export type FrontState = z.infer<typeof frontStateSchema>;

export function encodeOauthState(state: FrontState) {
	return encodeURIComponent(btoa(JSON.stringify(state)));
}

export function decodeOauthState(encodedState: string): FrontState {
	try {
		return frontStateSchema.parse(JSON.parse(atob(decodeURIComponent(encodedState))));
	} catch (_) {
		return {
			backState: encodedState,
			authTarget: null,
		};
	}
}
