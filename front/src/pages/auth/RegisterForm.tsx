import { A } from "@solidjs/router";

import "./RegisterForm.scss";
import Button from "~/components/ui/Button";
import TextInput from "~/components/ui/TextInput";
import { createSignal, JSXElement, Show } from "solid-js";
import { client } from "~/api/client";
import { registerSchema } from "@42eat-web/shared";
import { authActions } from "~/store/auth.store";

export default function RegisterForm() {
	const [username, setUsername] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [error, setError] = createSignal<JSXElement>(null);

	const loginMutation = client.auth.login.createMutation();

	let usernameInput!: HTMLInputElement;

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		const usernameValue = username();
		if (!registerSchema.shape.email.safeParse(usernameValue).success) {
			return usernameInput.setCustomValidity("Please enter a valid email");
		}
		loginMutation.mutate(
			{ body: { email: usernameValue, password: password() } },
			{
				onSuccess: (data) => {
					authActions.login(data.body.accessToken);
				},
				onError: (e) => {
					if (e.status === 401) {
						switch (e.body.code) {
							case "INTRA_ONLY_ACCOUNT":
								setError(
									<>
										This account is only accessible with the{" "}
										<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
											42's Intra login
										</a>
									</>,
								);
								break;
							case "INVALID_CREDENTIALS":
								setError("Invalid credential combination");
								break;
							default:
								setError(e.body.message);
						}
					} else if (e.status === 403) {
						setError(
							e.body.message ?? "An error occured. There is nothing to do :/",
						);
					}
					setError("An error occured. There is nothing to do :/");
				},
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} id="register-form">
			<div class="register-inputs">
				<TextInput type="text" placeholder="Display Name" />
				<TextInput ref={usernameInput} type="email" placeholder="Email" />
				<TextInput type="password" placeholder="Password" />
				<TextInput type="password" placeholder="Confirm password" />
				<Show when={error()}>
					<p class="invalid-message" role="alert">
						{error()}
					</p>
				</Show>
			</div>
			<p class="register-details">
				Already have an account? <A href="/auth/login">Login</A>.
			</p>
			<Button type="submit" onClick={console.log}>
				Register
			</Button>
			<div class="separator">
				<hr />
				OR
				<hr />
			</div>
			<Button class="ft-register-button" onClick={console.log}>
				Register with <p>42</p> Intra
			</Button>
		</form>
	);
}
