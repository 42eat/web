import { initQueryClient } from "@ts-rest/solid-query";
import { appContract } from "@42eat-web/shared";
import { auth } from "../store/auth.store";

export const client = initQueryClient(appContract, {
	baseUrl: import.meta.env.VITE_API_URL,
	baseHeaders: {
		Authorization: () => `Bearer ${auth.token}`,
	},
});
