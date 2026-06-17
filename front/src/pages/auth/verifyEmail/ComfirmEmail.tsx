import { createSignal, Match, onMount, Switch } from "solid-js";
import { client } from "~/api/client";
import "./ComfirmEmail.scss";
import { A, useLocation } from "@solidjs/router";
import DialogPage from "~/components/ui/DialogPage";
import { useTranslation } from "~/i18n/context";

type State = "WAITING" | "CONFIRMED" | "MISSING_TOKEN" | "ERROR";

export default function ConfirmEmail() {
	const { t } = useTranslation();
	const location = useLocation();

	const confirmEmailMutation = client.auth.confirmEmail.createMutation();
	const [state, setState] = createSignal<State>("WAITING");


	onMount(() => {
		const token = new URLSearchParams(location.search).get("token");
		if (!token) {
			setState("MISSING_TOKEN");
			return;
		}
		confirmEmailMutation.mutate(
			{ body: { token } },
			{
				onSuccess: () => setState("CONFIRMED"),
				onError: () => setState("ERROR"),
			},
		);
	});

	return <DialogPage id="confirm-email">
		<h2>{t("pages.confirmEmail.title")}</h2>
		<hr/>
		<div class="content">
			<Switch>
				<Match when={state() === "WAITING"}>
					<p>{t("pages.confirmEmail.loadingMessage")}</p>
				</Match>
				<Match when={state() === "CONFIRMED"}>
					<p>{t("pages.confirmEmail.successMessage")}</p>
					<A href="/home">{t("pages.confirmEmail.successLink")}</A>
				</Match>
				<Match when={state() === "MISSING_TOKEN"}>
					<p>{t("pages.confirmEmail.errorMessage")}</p>
					<A href="/home">{t("pages.confirmEmail.errorLink")}</A>
				</Match>
				<Match when={state() === "ERROR"}>
					<p>{t("pages.confirmEmail.errorMessage")}</p>
					<A href="/home">{t("pages.confirmEmail.errorLink")}</A>
				</Match>
			</Switch>
		</div>
	</DialogPage>;
}
