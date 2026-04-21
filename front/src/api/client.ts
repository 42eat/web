import { initQueryClient } from "@ts-rest/solid-query";
import { appContract } from "@42eat-web/shared";
import { auth, authActions } from "../store/auth.store";
import { ApiFetcher, tsRestFetchApi } from "@ts-rest/core";
import { env } from "~/env";
import { doRefresh } from "./doRefresh";

const fetchWithRefresh: ApiFetcher = async (args) => {
	const response = await tsRestFetchApi(args);

	if (response.status !== 401) return response;

	const accessToken = await doRefresh();

	if (accessToken === null) {
		authActions.logout();
		return response;
	}

	authActions.login(accessToken);

	return tsRestFetchApi({
		...args,
		headers: {
			...args.headers,
			Authorization: `Bearer ${accessToken}`,
		},
	});
};

export const client = initQueryClient(appContract, {
	baseUrl: env.VITE_API_URL,
	baseHeaders: {
		Authorization: () => `Bearer ${auth.accessToken}`,
	},
	api: fetchWithRefresh,
});
