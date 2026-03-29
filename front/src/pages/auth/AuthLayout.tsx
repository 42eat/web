import { A, RouteSectionProps, useLocation } from "@solidjs/router"
import { Transition } from "solid-transition-group"

import "./AuthLayout.scss"
import NeonLogo from "~/components/common/NeonLogo"

export default function AuthLayout(props: RouteSectionProps) {
	return <div id="auth-page">
		<div class="auth-hero">
			<NeonLogo />
		</div>
		<section class="auth-section">
			<header class="top-details"></header>
			<div class="auth-block">
				<h1>42's Foyer</h1>
				<Transition name="slide" mode="outin">
					<main class="form-container">
						{props.children}
					</main>
				</Transition>
			</div>
			<footer class="bottom-details"></footer>
		</section>
	</div>
}
