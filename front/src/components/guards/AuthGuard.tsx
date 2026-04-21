import { useNavigate, RouteSectionProps } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { auth } from "~/store/auth.store";

export default function AuthGuard(props: RouteSectionProps) {
	const navigate = useNavigate();

	createEffect(() => {
		if (!auth.accessToken) navigate("/auth/login", { replace: true });
	});

	return <Show when={auth.accessToken} >{props.children}</Show>;
}
