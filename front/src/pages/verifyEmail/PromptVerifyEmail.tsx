import { onMount, Show } from "solid-js";
import "./PromptVerifyEmail.scss";
import { authActions } from "~/store/auth.store";
import { client } from "~/api/client";
import Button from "~/components/ui/Button";

export default function PromptVerifyEmail() {

	const profile = client.members.profile.createQuery(() => ["members", "profile"], {});
	const logoutMutation = client.auth.logout.createMutation();

	onMount(() => {
		/** `void` in js will ignore the return value of the following function.
			* It's mostly used to only silence warnings by providing a exhaustive
			* way to ignore return values of a function
			* (every function doesn't need void to ignore return values, but in
			* our case ignored `Promises` create warnings)*/
		void authActions.refreshToken();
	});

	function logout() {
		logoutMutation.mutate({});
		authActions.logout();
	}

	return <>
		<Show when={profile.isFetched}>
			<pre><code>{JSON.stringify(profile.data?.body, null, 2)}</code></pre>
			<Button onClick={logout}>logout</Button>
		</Show>
		<p>VERIFIE TON EMAILLLLLLLL ({profile.data?.body.email}) !!!!!!!!!!!!! </p>;
	</>;
}
