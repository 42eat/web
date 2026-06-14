import { useNavigate } from "@solidjs/router";
import { createSignal, Match, onMount, Switch } from "solid-js";
import { client } from "~/api/client";
import { useTranslation } from "~/i18n/context";
import { authActions } from "~/store/auth.store";

type AuthCallbackError = {
	source: "server";
} | {
	source: "provider";
	code: string;
	description: string | null;
};

export default function FtAuthCallback() {
	const ftAuthMutation = client.auth.auth42.createMutation();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [error, setError] = createSignal<AuthCallbackError | null>(null);

	onMount(() => {
		const queryParams = new URLSearchParams(location.search);
		const errorParam = queryParams.get("error");
		if (errorParam) {
			navigate("/login");
			summon
			setError({ source: "provider", code: errorParam, description: queryParams.get("error_description")?.replace("+", " ") ?? null });
			return;
		}

		const code = queryParams.get("code");
		const state = queryParams.get("state");
		if (!code || !state) {
			setError({ source: "server" });
			return;
		}
		ftAuthMutation.mutate({ body: { code, state } }, {
			onSuccess: (r) => {
				authActions.login(r.body.accessToken);
				navigate("/home");
			},
			onError: () => setError({ source: "server" }),
		});
	});

	/** Usefull to narrow type of error */
	const providerError = () => {
		const e = error();
		return e?.source === "provider" && e;
	};

	return <main id="ft-auth-callback">
		<Switch>
			<Match when={error()?.source === "server"}>
				<section>
					{t("pages.ftAuthCallback.mainErrorMessage")}
					<br />
					{t("pages.ftAuthCallback.subErrorMessage")}
				</section>
			</Match>
			<Match when={providerError()} keyed>
				{(e) => (
					<section>
						{t("pages.ftAuthCallback.mainRefusedMessage")}
						<br />
						{t("pages.ftAuthCallback.subRefusedMessage")}
						<br />
						[{e.description}]
					</section>
				)}
			</Match>
		</Switch>
	</main>;
}
