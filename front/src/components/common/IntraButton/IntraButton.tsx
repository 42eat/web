import { createSignal, splitProps } from "solid-js";
import { client } from "~/api/client";
import Button from "~/components/ui/Button";
import { ButtonProps } from "~/components/ui/Button/Button";
import { summonErrorToast } from "~/components/ui/Toaster";
import { useTranslation } from "~/i18n/context";
import "./IntraButton.scss";
import { encodeOauthState } from "~/utils/encodeOauthState";
import { MessageEventData } from "~/types/MessageEventData";
import { useLocation } from "@solidjs/router";

export type IntraButtonProps = ButtonProps;

export default function IntraButton(props: IntraButtonProps) {
	const { t } = useTranslation();
	const location = useLocation();
	const [fetchingUrl, setFetchingUrl] = createSignal(false);
	const [local, rest] = splitProps(props, ["class", "disabled"]);

	const messageListener = (event: MessageEvent<MessageEventData>) => {
		if (event.origin !== window.location.origin) return;
		if (event.data?.type === "ft-oauth-error") {
			summonErrorToast(<div>{t("pages.ftAuthCallback.mainErrorMessage")}<br />{t("pages.ftAuthCallback.subErrorMessage")}</div>);
		}
		cleanup();
	};

	let closeChecker: number = -1;

	function cleanup() {
		clearInterval(closeChecker);
		window.removeEventListener("message", messageListener);
		setFetchingUrl(false);
	}

	async function handleClick(e: MouseEvent) {
		setFetchingUrl(true);
		const response = await client.auth.getLogin42url.query();
		if (response.status == 200) {
			const url = new URL(response.body.url);
			const state = url.searchParams.get("state");
			const localSearchParams = new URLSearchParams(location.search);
			const localAuthTarget = localSearchParams.get("authTarget");

			const openToBlank = e.ctrlKey || e.button === 1;

			url.searchParams.set("state", encodeOauthState({ backState: state ?? "", authTarget: openToBlank ? "_parent" : localAuthTarget }));
			const popup = window.open(url, openToBlank ? "_blank" : "_self");
			if (openToBlank && popup) {
				closeChecker = window.setInterval(() => { if (popup.closed) cleanup(); }, 500);
				window.addEventListener("message", messageListener);
			}
		} else {
			summonErrorToast(t("errors.unknownFallback"));
		}
	}

	return <Button
		type="button"
		class={`ft-login-button ${local.class ?? ""}`}
		disabled={fetchingUrl()}
		onAuxClick={(e) => void handleClick(e)}
		onClick={(e) => void handleClick(e)}
		{...rest} />;
}
