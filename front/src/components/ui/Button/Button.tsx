import { JSX, splitProps } from "solid-js";
import "./Button.scss";

type ButtonProps = JSX.IntrinsicElements["button"] & {
	variant?: "primary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
};

export default function Button(props: ButtonProps) {
	const [local, rest] = splitProps(props, ["variant", "size", "class", "children"]);

	return <button class={`btn btn--${local.variant ?? "primary"} btn--${local.size ?? "md"} ${local.class ?? ""}`} {...rest}><span class="btn-content">{local.children}</span></button>;
}
