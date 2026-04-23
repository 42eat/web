import { createSignal, Match, onMount, Switch } from "solid-js";
import { client } from "~/api/client";
import "./ComfirmEmail.scss";
import { A } from "@solidjs/router";

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
	return <Switch>
		<Match when={state() === "WAITING"}>
			<p>ATTENDSSSSSSSSSSSSSS !!!!!!</p>
		</Match>
		<Match when={state() === "CONFIRMED"}>
			<p>BRAVOOO</p>
			<p>Maintenant VA Là: <A href="/home">ICI</A></p>
		</Match>
		<Match when={state() === "MISSING_TOKEN"}>
			GAAAAAAAAA
		</Match>
		<Match when={state() === "ERROR"}>
			GOOOOOOOO
		</Match>
	</Switch>;
}
