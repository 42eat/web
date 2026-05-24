import { A } from "@solidjs/router";

import "./RegisterForm.scss";
import Button from "~/components/ui/Button";
import TextInput from "~/components/ui/TextInput";
import { createSignal, JSXElement, Show } from "solid-js";
import { client } from "~/api/client";
import { registerSchema } from "@42eat-web/shared";
import { authActions } from "~/store/auth.store";
import Form from "~/components/ui/Form/Form";
import { validateFromZod } from "~/utils/validateFromZod";
import { useTranslation } from "~/i18n/context";

export default function RegisterForm() {
	const [error, setError] = createSignal<JSXElement>(null);
	const { t } = useTranslation();

	const registerMutation = client.auth.register.createMutation();

	let displayNameInput!: HTMLInputElement;
	let emailInput!: HTMLInputElement;
	let passwordInput!: HTMLInputElement;

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		registerMutation.mutate(
			{
				body: {
					displayName: displayNameInput.value,
					email: emailInput.value,
					password: passwordInput.value,
				},
			},
			{
				onSuccess: (data) => {
					authActions.login(data.body.accessToken);
				},
				onError: (e) => {
					if (e.status === 409) {
						setError(t("errors.register.conflictingEmail"));
					} else {
						setError("An error occured. There is nothing to do :/");
					}
				},
			},
		);
	}

	return <Form onSubmit={handleSubmit} id="register-form">
		<div class="register-inputs">
			<TextInput ref={(e) => displayNameInput = e.htmlElement} type="text" validator={(e) => validateFromZod(registerSchema.shape.displayName, e.value)} placeholder="Display Name" required />
			<TextInput ref={(e) => emailInput = e.htmlElement} type="email" validator={(e) => validateFromZod(registerSchema.shape.email, e.value)} placeholder="Email" required />
			<TextInput ref={(e) => passwordInput = e.htmlElement} type="password" validator={(e) => validateFromZod(registerSchema.shape.password, e.value)} placeholder="Password" required />
			<TextInput type="password" validator={(e) => e.value !== passwordInput.value && t("errors.input.text.password.confirmationMismatch")} placeholder="Confirm password" />
			<Show when={error()}>
				<p class="invalid-message" role="alert">
					{error()}
				</p>
			</Show>
		</div>
		<Button type="submit">
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
		<p class="register-details">
			Already have an account? <A href="/auth/login">Login</A>.
		</p>
	</Form>;
}
