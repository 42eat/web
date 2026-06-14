import { initQueryClient } from "@ts-rest/solid-query";
import { appContract } from "@42eat-web/shared";
import { auth, authActions } from "../store/auth.store";
import { ApiFetcher, tsRestFetchApi } from "@ts-rest/core";
import { env } from "~/env";
import { doRefresh } from "./doRefresh";
import z from "zod";
import { error401Schema } from "@42eat-web/shared";
import { summonWarningToast } from "~/components/ui/Toaster";
import { t } from "~/i18n/context";
import { queryKeyFromContract } from "./utils/queryKeys";

const fetchWithRefresh: ApiFetcher = async (args) => {
	const response = await tsRestFetchApi(args);

	if (response.status === 429) {
		summonWarningToast(t("errors.rateLimit"));
	}

	if (response.status !== 401
		|| !response.body
		|| (response.body
			&& (response.body as z.infer<typeof error401Schema>).code !== "INVALID_TOKEN")
	) return response;

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

export const queryKeys = queryKeyFromContract(appContract);

export const test = console.log(queryKeys);
