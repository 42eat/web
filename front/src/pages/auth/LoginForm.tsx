import { A } from "@solidjs/router";
import Button from "../../components/ui/Button";
import TextInput from "~/components/ui/TextInput";
import { client } from "~/api/client";
import { createSignal } from "solid-js";
import { authActions } from "~/store/auth.store";

import "./LoginForm.scss"

export default function LoginForm() {
	const [username, setUsername] = createSignal("");
	const [password, setPassword] = createSignal("");

	console.log("test")
	const loginMutation = client.auth.login.createMutation();
	console.log("test2");

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		loginMutation.mutate({ body: { email: username(), password: password() } }, {
			onSuccess: (data) => {
				authActions.login(data.body.accessToken);
			},
			onError: (e) => {
				console.error(e);
			}
		})
	}

	return <form onSubmit={handleSubmit} id="login-form">
		<div class="login-inputs">
			<TextInput type="text" placeholder="Email or 42's login" value={username()} onInput={(e) => setUsername((e.target as HTMLInputElement).value)} />
			<TextInput type="password" placeholder="Password" value={password()} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} />
		</div>
		<p class="login-details">Need an account? <A href="/auth/register">Register</A>.</p>
		<Button type="submit" >Login</Button>
		<div class="separator">
			<hr />
			OR
			<hr />
		</div>
		<Button class="ft-login-button" onClick={console.log}>Login with <p>42</p> Intra</Button>
	</form>
}
