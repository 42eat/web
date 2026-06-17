import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { client } from "~/api/client";
import { summonErrorToast } from "~/components/ui/Toaster";
import { useTranslation } from "~/i18n/context";
import { authActions } from "~/store/auth.store";
import { MessageEventData } from "~/types/MessageEventData";
import { decodeOauthState } from "~/utils/encodeOauthState";

export default function FtAuthCallback() {
	const ftAuthMutation = client.auth.auth42.createMutation();
	const navigate = useNavigate();
	const { t } = useTranslation();

	function onError(authTarget?: string | null) {
		if (authTarget === "_parent") {
			window.parent?.postMessage({ type: "ft-oauth-error" } satisfies MessageEventData, window.location.origin);
			window.close();
		} else {
			navigate("/login", { replace: true });
			summonErrorToast(<div>{t("pages.ftAuthCallback.mainErrorMessage")}<br />{t("pages.ftAuthCallback.subErrorMessage")}</div>);
		}
	}

	function onRefuse(authTarget?: string | null) {
		if (authTarget === "_parent") {
			window.parent?.postMessage({ type: "ft-oauth-error" } satisfies MessageEventData, window.location.origin);
			window.close();
		} else {
			navigate("/login", { replace: true });
		}
	}

	onMount(() => {
		const queryParams = new URLSearchParams(location.search);

		const state = queryParams.get("state");
		if (!state) return onError();
		const { backState, authTarget } = decodeOauthState(state);

		const errorParam = queryParams.get("error");
		if (errorParam) {
			if (errorParam === "access_denied") return onRefuse(authTarget);
			return onError(authTarget);
		}

		const code = queryParams.get("code");
		if (!code) return onError(authTarget);

		ftAuthMutation.mutate({ body: { code, state: backState } }, {
			onSuccess: (r) => {
				authActions.login(r.body.accessToken);
				if (authTarget === "_parent") window.close();
				navigate(authTarget ?? "/home", { replace: true });
			},
			onError: () => onError(authTarget),
		});
	});

	return <main id="ft-auth-callback" />;
}
