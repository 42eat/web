import { A, AnchorProps, useLocation } from "@solidjs/router";
import { Component, JSX } from "solid-js";
import "./NavLink.scss";

export interface NavLinkProps extends AnchorProps {
	icon: Component<JSX.IntrinsicElements["svg"]>;
}

export default function NavLink(props: NavLinkProps) {
	const location = useLocation();
	return <A class={`nav-link ${location.pathname === props.href ? "focused" : ""} ${props.class}`} {...props}>
		<props.icon/>
		{props.children}
	</A>;
}
