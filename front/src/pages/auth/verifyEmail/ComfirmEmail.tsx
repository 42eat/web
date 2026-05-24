import { createSignal, Match, onMount, Switch } from "solid-js";
import { client } from "~/api/client";
import "./ComfirmEmail.scss";
import { A } from "@solidjs/router";
import DialogPage from "~/components/ui/DialogPage";

type State = "WAITING" | "CONFIRMED" | "MISSING_TOKEN" | "ERROR";

export default function ConfirmEmail() {
	const confirmEmailMutation = client.auth.confirmEmail.createMutation();
	const [state, setState] = createSignal<State>("WAITING");

	onMount(() => {
		const token = new URLSearchParams(window.location.search).get("token");
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
		<h2>Vérifie ton email</h2>
		<hr/>
		<div class="content">
			<Switch>
				<Match when={state() === "WAITING"}>
					<p>On prépare tout, attends juste une petite seconde...</p>
				</Match>
				<Match when={state() === "CONFIRMED"}>
					<p>Tout est bon, ton compte est prêt !</p>
					<A href="/home">Aller à la page d'accueil</A>
				</Match>
				<Match when={state() === "MISSING_TOKEN"}>
					<p>Mmh... On a rencontré un problème :(</p>
					<A href="/home">Retourner en lieu sûr</A>
				</Match>
				<Match when={state() === "ERROR"}>
					<p>Mmh... On a rencontré un problème :(</p>
					<A href="/home">Retourner en lieu sûr</A>
				</Match>
			</Switch>
		</div>
	</DialogPage>;
}
