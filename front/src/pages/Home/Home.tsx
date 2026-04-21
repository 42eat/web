import { Show } from "solid-js";
import { client } from "~/api/client";

export default function Home() {
	const profile = client.members.profile.createQuery(() => ["members", "profile"], () => ({}));

	return <div style={{ background: "red" }}>
		HOME, SWEET HOME ...
		<Show when={profile.isFetched}>
			<pre><code>{JSON.stringify(profile.data?.body, null, 2)}</code></pre>
		</Show>
	</div>;
}
