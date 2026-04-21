import { authContract } from "@42eat-web/shared";
import { initClient } from "@ts-rest/core";
import { env } from "~/env";

const refreshClient = initClient(authContract, {
	baseUrl: env.VITE_API_URL,
});

let refreshPromise: Promise<string | null> | null = null;

export async function doRefresh(): Promise<string | null> {
	if (refreshPromise) return refreshPromise;

	refreshPromise = refreshClient.refresh().
		then((r) => r.status === 200
			? r.body.accessToken
			: null).
		finally(() => { refreshPromise = null; });

	return refreshPromise;
}
