import { A } from "@solidjs/router";
import Button from "../../components/ui/Button";
import TextInput from "~/components/ui/TextInput";
import { client } from "~/api/client";
import { createSignal, JSXElement, Show } from "solid-js";
import { authActions } from "~/store/auth.store";

import "./LoginForm.scss"

export default function LoginForm() {
	const [username, setUsername] = createSignal("a@a.fr");
	const [password, setPassword] = createSignal("dzq");
	const [error, setError] = createSignal<JSXElement>(null);

	const loginMutation = client.auth.login.createMutation();


	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		loginMutation.mutate({ body: { email: username(), password: password() } }, {
			onSuccess: (data) => {
				authActions.login(data.body.accessToken);
			},
			onError: (e) => {
				if (e.status === 401) {
					switch (e.body.code) {
						case "INTRA_ONLY_ACCOUNT":
							setError(<>This account is only accessible with the <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">42's Intra login</a></>);
							break;
						case "INVALID_CREDENTIALS":
							setError("Invalid credential combination");
							break;
						default:
							setError("An error occured. There is nothing to do :/");
					}
				} else {
					setError("An error occured. There is nothing to do :/");
				}
			}
		})
	};

	return <form onSubmit={handleSubmit} id="login-form">
		<div class="login-inputs">
			<TextInput type="email" placeholder="Email" required invalidMessage="Valid email required" value={username()} onInput={(e) => setUsername((e.target as HTMLInputElement).value)} />
			<TextInput type="password" placeholder="Password" required invalidMessage="Password required" value={password()} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} />
			<Show when={error()}>
				<p class="invalid-message" role="alert">
					{error()}
				</p>
			</Show>
		</div>
		<div class="login-details">
			<p class="auth-switcher">Need an account? <A href="/auth/register">Register</A>.</p>
		</div>
		<Button type="submit" >Login</Button>
		<div class="separator">
			<hr />
			OR
			<hr />
		</div>
		<Button class="ft-login-button" onClick={console.log}>Login with <p>42</p> Intra</Button>
	</form>
}
