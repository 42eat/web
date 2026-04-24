import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { useAuth } from "./AuthGuard";

export default function UnverifiedEmailGuard(props: RouteSectionProps) {
	const navigate = useNavigate();
	const auth = useAuth();

	createEffect(() => {
		if (auth.jwtPayload.emailVerified) navigate("/home");
	});

	return <Show when={!auth.jwtPayload.emailVerified}>{props.children}</Show>;
}
