import { createEffect, splitProps } from "solid-js";
import { client, queryKeys } from "~/api/client";
import Button from "~/components/ui/Button";
import { ButtonProps } from "~/components/ui/Button/Button";
import { summonErrorToast } from "~/components/ui/Toaster";
import { useTranslation } from "~/i18n/context";
import "./IntraButton.scss";

export type IntraButtonProps = ButtonProps;

export default function IntraButton(props: IntraButtonProps) {
	const { t } = useTranslation();

	const [local, rest] = splitProps(props, ["class", "disabled"]);

	const intraAuthUrl = client.auth.getLogin42url.createQuery(queryKeys.auth.getLogin42url, {});

	createEffect(() => {
		if (intraAuthUrl.isError) summonErrorToast(t("errors.unavailableFtApi"));
	});

	function redirect(url: string, e: MouseEvent) {
		const a = document.createElement("a");
		a.href = url;
		a.dispatchEvent(new Event("click", e));
	}

	async function handleClick(e: MouseEvent) {
		const response = await client.auth.getLogin42url.query();
		switch (response.status) {
			case 200:
				redirect(response.body.url, e);
				return;
			default:
				summonErrorToast(t("errors.unknownFallback"));
		}
	}

	return <Button
		type="button"
		class={`ft-login-button ${local.class ?? ""}`}
		disabled={intraAuthUrl.isFetching}
		onClick={(e) => { void handleClick(e); }} {...rest} />;
}
