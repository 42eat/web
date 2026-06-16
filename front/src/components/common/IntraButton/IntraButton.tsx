import { createSignal, splitProps } from "solid-js";
import { client } from "~/api/client";
import Button from "~/components/ui/Button";
import { ButtonProps } from "~/components/ui/Button/Button";
import { summonErrorToast } from "~/components/ui/Toaster";
import { useTranslation } from "~/i18n/context";
import "./IntraButton.scss";
import { encodeOauthState } from "~/utils/encodeOauthState";
import { useLocation } from "@solidjs/router";

export type IntraButtonProps = ButtonProps;

export default function IntraButton(props: IntraButtonProps) {
	const { t } = useTranslation();
	const location = useLocation();
	const [fetchingUrl, setFetchingUrl] = createSignal(false);
	const [local, rest] = splitProps(props, ["class", "disabled"]);

	async function handleClick(e: MouseEvent) {
		setFetchingUrl(true);
		const response = await client.auth.getLogin42url.query();
		if (response.status == 200) {
			const url = new URL(response.body.url);
			const state = url.searchParams.get("state");
			const localSearchParams = new URLSearchParams(location.search);
			const localAuthTarget = localSearchParams.get("authTarget");

			url.searchParams.set("state", encodeOauthState({ backState: state ?? "", authTarget: e.ctrlKey ? "_parent" : localAuthTarget }));
			window.open(url, e.ctrlKey ? "_blank" : "_self");
		} else {
			summonErrorToast(t("errors.unknownFallback"));
		}
		setFetchingUrl(false);
	}

	return <Button
		type="button"
		class={`ft-login-button ${local.class ?? ""}`}
		disabled={fetchingUrl()}
		onClick={(e) => { void handleClick(e); }} {...rest} />;
}
