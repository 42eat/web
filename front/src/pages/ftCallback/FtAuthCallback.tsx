import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { client } from "~/api/client";
import { summonErrorToast, summonWarningToast } from "~/components/ui/Toaster";
import { useTranslation } from "~/i18n/context";
import { authActions } from "~/store/auth.store";

export default function FtAuthCallback() {
	const ftAuthMutation = client.auth.auth42.createMutation();
	const navigate = useNavigate();
	const { t } = useTranslation();

	function onError() {
		navigate("/login", { replace: true });
		summonErrorToast(<div>
			{t("pages.ftAuthCallback.mainErrorMessage")}
			<br />
			{t("pages.ftAuthCallback.subErrorMessage")}
		</div>);
	}

	function onRefuse() {
		navigate("/login", { replace: true });
		summonWarningToast(<div>
			{t("pages.ftAuthCallback.mainRefusedMessage")}
			<br />
			{t("pages.ftAuthCallback.subRefusedMessage")}
		</div>);
	}

	onMount(() => {
		const queryParams = new URLSearchParams(location.search);
		const errorParam = queryParams.get("error");
		if (errorParam) {
			if (errorParam === "access_denied") return onRefuse();
			return onError();
		}

		const code = queryParams.get("code");
		const state = queryParams.get("state");
		if (!code || !state) return onError();

		ftAuthMutation.mutate({ body: { code, state } }, {
			onSuccess: (r) => {
				authActions.login(r.body.accessToken);
				navigate("/home", { replace: true });
			},
			onError: () => onError(),
		});
	});

	return <main id="ft-auth-callback" />;
}
