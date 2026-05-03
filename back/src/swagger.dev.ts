export const customSwaggerJs = `
(() => {
	const ACCESS_TOKEN_KEY = "swagger_access_token";
	const REFRESH_RETRY_HEADER = "x-swagger-refresh-retry";

	const getUi = () => window.ui;

	const setBearerInUi = (token) => {
		const ui = getUi();
		if (!ui || !ui.authActions || !token) return;

		ui.authActions.authorize({
			bearerAuth: {
				name: "bearerAuth",
				schema: {
					type: "http",
					in: "header",
					name: "Authorization",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
				value: token,
			},
		});
	};

	const saveAccessToken = (token) => {
		if (!token) return;
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
		setBearerInUi(token);
	};

	const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

	const shouldAttachAuth = (url) => {
		try {
			const parsed = new URL(url, window.location.origin);
			return parsed.origin === window.location.origin;
		} catch {
			return false;
		}
	};

	const isAuthSuccessEndpoint = (url) => {
		try {
			const parsed = new URL(url, window.location.origin);
			if (parsed.origin !== window.location.origin) return false;
			if (parsed.pathname.endsWith("/auth/login")) return true;
			if (parsed.pathname.endsWith("/auth/register")) return true;
			if (parsed.pathname.endsWith("/auth/refresh")) return true;
			if (parsed.pathname.endsWith("/auth/42/auth")) return true;
			return false;
		} catch {
			return false;
		}
	};

	const parseTokenFromResponse = async (response) => {
		try {
			const clone = response.clone();
			const body = await clone.json();
			return body?.accessToken ?? null;
		} catch {
			return null;
		}
	};

	const waitForUiAndRestoreToken = () => {
		const tryRestore = () => {
			if (!getUi()) return false;
			const token = getAccessToken();
			if (token) setBearerInUi(token);
			return true;
		};

		if (tryRestore()) return;

		const interval = setInterval(() => {
			if (tryRestore()) clearInterval(interval);
		}, 100);
	};

	const originalFetch = window.fetch.bind(window);

	window.fetch = async (input, init = {}) => {
		const requestUrl = typeof input === "string" ? input : input?.url;
		const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));

		if (requestUrl && shouldAttachAuth(requestUrl)) {
			const token = getAccessToken();
			if (token && !headers.has("Authorization")) {
				headers.set("Authorization", "Bearer " + token);
			}
		}

		const requestInit = {
			...init,
			headers,
			credentials: "include",
		};

		let response = await originalFetch(input, requestInit);

		if (requestUrl && isAuthSuccessEndpoint(requestUrl) && response.ok) {
			const token = await parseTokenFromResponse(response);
			saveAccessToken(token);
		}

		const isRetry = headers.has(REFRESH_RETRY_HEADER);
		const isRefreshRequest = requestUrl ? requestUrl.includes("/auth/refresh") : false;

		if (
			requestUrl
			&& shouldAttachAuth(requestUrl)
			&& response.status === 401
			&& !isRetry
			&& !isRefreshRequest
		) {
			const refreshResponse = await originalFetch("/auth/refresh", {
				method: "POST",
				credentials: "include",
			});

			if (refreshResponse.ok) {
				const newToken = await parseTokenFromResponse(refreshResponse);
				saveAccessToken(newToken);

				const retryHeaders = new Headers(requestInit.headers);
				retryHeaders.set(REFRESH_RETRY_HEADER, "1");
				if (newToken) retryHeaders.set("Authorization", "Bearer " + newToken);

				response = await originalFetch(input, {
					...requestInit,
					headers: retryHeaders,
					credentials: "include",
				});
			}
		}

		return response;
	};

	waitForUiAndRestoreToken();
})();
`;
