
import { useTranslation } from "~/i18n/context";
import "./ResetPassword.scss";
import Form from "~/components/ui/Form/Form";
import TextInput from "~/components/ui/TextInput";
import { validateFromZod } from "~/utils/validateFromZod";
import { resetPasswordSchema } from "@42eat-web/shared";
import { client } from "~/api/client";
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import Button from "~/components/ui/Button";
import DialogPage from "~/components/ui/DialogPage";
import { summonErrorToast, summonSuccessToast } from "~/components/ui/Toaster";

export default function ResetPassword() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [error, setError] = createSignal(false);

	let token!: string;

	onMount(() => {
		const localToken = new URLSearchParams(window.location.search).get("token");
		if (!localToken) {
			navigate("/auth/login", { replace: true });
			return;
		}
		token = localToken;
	});

	let passwordInput!: HTMLInputElement;

	const resetPasswordMutation = client.auth.resetPassword.createMutation();

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		setError(false);

		resetPasswordMutation.mutate(
			{ body: { token, newPassword: passwordInput.value } },
			{
				onSuccess: () => {
					summonSuccessToast(<div>OK</div>);
					navigate("/auth/login");
				},
				onError: (error) => {
					if (error.status === 401) {
						summonErrorToast(<div>ERROR</div>, { ttl: 11111111 });
						navigate("/auth/request-password-reset");
					} else {
						setError(true);
					}
				},
			},
		);
	}

	return <DialogPage id="reset-password">
		<h2>{t("pages.resetPassword.title")}</h2>
		<Form class="reset-password-form" onSubmit={handleSubmit}>
			<div class="inputs">
				<TextInput ref={(e) => passwordInput = e.htmlElement} type="password" validator={(e) => validateFromZod(resetPasswordSchema.shape.newPassword, e.value)} placeholder={t("pages.resetPassword.inputs.newPassword")} required />
				<TextInput type="password" validator={(e) => e.value !== passwordInput.value && t("errors.input.text.password.confirmationMismatch")} placeholder={t("pages.resetPassword.inputs.confirmNewPassword")} />
			</div>
			<Button >{t("pages.resetPassword.submitButton")}</Button>
		</Form>
		<Show when={error()}>
			<p class="error-message">{t("errors.unknownFallback")}</p>
		</Show>
	</DialogPage>;
}
