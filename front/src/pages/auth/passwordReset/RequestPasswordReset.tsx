
import { useTranslation } from "~/i18n/context";
import TextInput from "~/components/ui/TextInput";
import { authContract } from "@42eat-web/shared";
import { validateFromZod } from "~/utils/validateFromZod";
import Button from "~/components/ui/Button";
import Form from "~/components/ui/Form/Form";
import { client } from "~/api/client";
import { Match, Show, Switch } from "solid-js";
import "./RequestPasswordReset.scss";
import DialogPage from "~/components/ui/DialogPage";

export default function RequestPasswordReset() {
	const { t } = useTranslation();
	const requestPasswordReset = client.auth.requestPasswordReset.createMutation();

	let emailInput!: HTMLInputElement;

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		requestPasswordReset.mutate({ body: { email: emailInput.value } });
	};

	function isRateLimitError(error: NonNullable<typeof requestPasswordReset.error>) {
		if (error.status === 429) {
			return error;
		}
		return false;
	}

	return <DialogPage id="request-password-reset">
		<h1>{t("pages.requestPasswordReset.title")}</h1>
		<p class="description">{t("pages.requestPasswordReset.description")}</p>
		<Form onSubmit={handleSubmit} >
			<div class="inputs">
				<TextInput
					ref={(e) => emailInput = e.htmlElement}
					type="email"
					required
					disabled={requestPasswordReset.isPending}
					placeholder={t("pages.requestPasswordReset.input.placeholder")}
					validator={(e) => validateFromZod(authContract.requestPasswordReset.body.shape.email, e.value)}
				/>
				<Button type="submit" style={{ transition: requestPasswordReset.isPending ? "0ms" : undefined }} disabled={requestPasswordReset.isPending}>{"->"}</Button>
			</div>
		</Form>
		<Show when={requestPasswordReset.isError && requestPasswordReset.error} keyed>
			{(error) => <Switch>
				<Match when={isRateLimitError(error)} keyed>
					{(rateLimitError) => <p class="invalid-message">
						{t("pages.requestPasswordReset.rateLimit", { time: rateLimitError.body.retryAfter })}
					</p>}
				</Match>
				<Match when={true}>
					<p class="invalid-message">
						{t("pages.requestPasswordReset.error")}
					</p>
				</Match>
			</Switch>}
		</Show>
		<Show when={requestPasswordReset.isSuccess}>
			<p class="success-message">
				{t("pages.requestPasswordReset.success")}
			</p>
		</Show>
	</DialogPage>;
}
