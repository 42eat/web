import { onMount, Show } from "solid-js";
import "./PromptVerifyEmail.scss";
import { authActions } from "~/store/auth.store";
import { client, queryKeys } from "~/api/client";
import { useTranslation } from "~/i18n/context";
import DialogPage from "~/components/ui/DialogPage";

import "./PromptVerifyEmail.scss";

export default function PromptVerifyEmail() {
	const { t } = useTranslation();

	const profile = client.members.profile.createQuery(queryKeys.members.profile, {});
	const logoutMutation = client.auth.logout.createMutation();
	const resendEmailMutation = client.auth.askNewConfirmationEmail.createMutation();

	onMount(() => {
		/** `void` in js will ignore the return value of the following function.
			* It's mostly used to only silence warnings by providing a exhaustive
			* way to ignore return values of a function
			* (every function doesn't need void to ignore return values, but in
			* our case ignored `Promises` create warnings)*/
		void authActions.refreshToken();
	});

	function resendEmail() {
		resendEmailMutation.mutate({});
	}

	function logout() {
		logoutMutation.mutate({});
		authActions.logout();
	}

	return <Show when={profile.isFetched && profile.data} keyed>
		{(data) => (<DialogPage id="prompt-verify-email">
			<div class="main-block">
				<h1>{t("pages.promptVerifyEmail.title")}</h1>
				<p class="main-content">{t("pages.promptVerifyEmail.mainContent")}</p>
				<p class="email">{data.body.email}</p>
			</div>
			<p class="description">
				{t("pages.promptVerifyEmail.description")}
				<br />
				{t("pages.promptVerifyEmail.spamMention")}
			</p>
			<hr />
			<div class="resend-block">
				<p>{t("pages.promptVerifyEmail.resendText")}</p>
				<a onClick={(e) => { e.preventDefault(); resendEmail(); }}>{t("pages.promptVerifyEmail.resendLink")}</a>
			</div>
			<a class="logout-link" onClick={(e) => { e.preventDefault(); logout(); }}>{t("pages.promptVerifyEmail.logout")}</a>
		</DialogPage>)}
	</Show>;
}
