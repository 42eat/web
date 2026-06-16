import { A, RouteSectionProps } from "@solidjs/router";
import ProfileCard from "../ProfileCard/ProfileCard";
import "./NavBar.scss";
import HouseIcon from "~/components/graphics/icons/HouseIcon";

export default function NavBar(props: RouteSectionProps) {
	return <div id="app-page">
		<nav id="app-page-nav">
			<ProfileCard />
			<hr />
			<div>
				<A class="nav-link" href="/home">
					<HouseIcon />
					Home
				</A>
			</div>
		</nav>
		<main id="app-page-content">
			{props.children}
		</main>
	</div>;
}
