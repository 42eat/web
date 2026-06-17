import { RouteSectionProps } from "@solidjs/router";
import ProfileCard from "../ProfileCard/ProfileCard";
import "./NavBar.scss";
import HouseIcon from "~/components/graphics/icons/HouseIcon";
import NavLink from "./NavLink/NavLink";
import BurgerIcon from "~/components/graphics/icons/BurgerIcon";

export default function NavBar(props: RouteSectionProps) {
	return <div id="app-page">
		<nav id="app-page-nav">
			<ProfileCard />
			<hr />
			<div>
				<NavLink icon={HouseIcon} href="/home">Home</NavLink>
				<NavLink icon={BurgerIcon} href="/menu">Home</NavLink>
			</div>
		</nav>
		<main id="app-page-content">
			{props.children}
		</main>
	</div>;
}
