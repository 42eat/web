import { Show } from "solid-js";
import { client, queryKeys } from "~/api/client";
import Button from "~/components/ui/Button";
import { authActions } from "~/store/auth.store";

export default function Home() {
	const profile = client.members.profile.createQuery(queryKeys.members.profile, () => ({}));


	function logout() {
		authActions.logout();
	}

	return <div style={{ background: "red" }}>
		HOME, SWEET HOME ...
		<Show when={profile.isFetched}>
			<pre><code>{JSON.stringify(profile.data?.body, null, 2)}</code></pre>
			<Button onClick={logout}>logout</Button>
		</Show>
	</div>;
}
