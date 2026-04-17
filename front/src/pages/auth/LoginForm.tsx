import { A } from "@solidjs/router";
import Button from "../../components/ui/Button";
import TextInput from "~/components/ui/TextInput";
import { client } from "~/api/client";
import { createSignal, JSXElement, Show } from "solid-js";
import { authActions } from "~/store/auth.store";
import { loginSchema } from "@42eat-web/shared";
import { useTranslation } from "~/i18n/context";
import "./LoginForm.scss";

export default function LoginForm() {
	const [username, setUsername] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [error, setError] = createSignal<JSXElement>(null);

	const { t } = useTranslation();

	const loginMutation = client.auth.login.createMutation();

	let usernameInput!: HTMLInputElement;

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		const usernameValue = username();
		const emailValidation = loginSchema.shape.email.safeParse(usernameValue);
		if (!emailValidation.success) {
			return usernameInput.setCustomValidity(emailValidation.error.message);
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
								setError(<>
									{t("pages.login.error.intraOnly.begin")}
									<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">{t("pages.login.error.intraOnly.link")}</a>
									{t("pages.login.error.intraOnly.end")}
								</>);
								break;
							case "INVALID_CREDENTIALS":
								setError(t("pages.login.error.invalidCredentials"));
								break;
							default:
								setError(e.body.message);
						}
					} else if (e.status === 403) {
						setError(e.body.message ?? "An error occured. There is nothing to do :/");
					} else {
						setError("An error occured. There is nothing to do :/");
					}
				},
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} id="login-form">
			<div class="login-inputs">
				<TextInput
					ref={usernameInput}
					type="email"
					placeholder="Email"
					required
					value={username()}
					onInput={(e) => setUsername(e.currentTarget.value)}
				/>
				<TextInput
					type="password"
					placeholder="Password"
					required
					value={password()}
					onInput={(e) => setPassword(e.currentTarget.value)}
				/>
				<Show when={error()}>
					<p class="invalid-message" role="alert">
						{error()}
					</p>
				</Show>
			</div>
			<div class="login-details">
				<p class="auth-switcher">
					Need an account? <A href="/auth/register">Register</A>.
				</p>
			</div>
			<Button type="submit">Login</Button>
			<div class="separator">
				<hr />
				OR
				<hr />
			</div>
			<Button class="ft-login-button" onClick={console.log}>
				Login with <p>42</p> Intra
			</Button>
		</form>
	);
}
