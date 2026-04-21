import { A } from "@solidjs/router";
import Button from "../../components/ui/Button";
import TextInput from "~/components/ui/TextInput";
import { client } from "~/api/client";
import { createSignal, JSXElement, Show } from "solid-js";
import { authActions } from "~/store/auth.store";
import { loginSchema } from "@42eat-web/shared";
import { useTranslation } from "~/i18n/context";
import "./LoginForm.scss";
import Form from "~/components/ui/Form/Form";
import { validateFromZod } from "~/utils/validateFromZod";

export default function LoginForm() {
	const [error, setError] = createSignal<JSXElement>(null);

	const { t } = useTranslation();

	const loginMutation = client.auth.login.createMutation();

	let usernameInput!: HTMLInputElement;
	let passwordInput!: HTMLInputElement;

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		loginMutation.mutate(
			{ body: { email: usernameInput.value, password: passwordInput.value } },
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
		<Form onSubmit={handleSubmit} id="login-form">
			<div class="login-inputs">
				<TextInput ref={(e) => usernameInput = e.htmlElement} type="email" validator={(e) => validateFromZod(loginSchema.shape.email, e.value)} placeholder="Email" required />
				<TextInput ref={(e) => passwordInput = e.htmlElement} type="password" validator={(e) => validateFromZod(loginSchema.shape.password, e.value)} placeholder="Password" required />
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
		</Form>
	);
}
