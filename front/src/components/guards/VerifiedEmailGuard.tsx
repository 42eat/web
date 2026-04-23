import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { useAuth } from "./AuthGuard";

export default function VerifiedEmailGuard(props: RouteSectionProps) {
	const navigate = useNavigate();
	const auth = useAuth();

	createEffect(() => {
		if (!auth.jwtPayload.emailVerified) navigate("/verify-email");
	});

	return <Show when={auth.jwtPayload.emailVerified}>{props.children}</Show>;
}
