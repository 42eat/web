import { RouteSectionProps } from "@solidjs/router";
import ProfileCard from "../ProfileCard/ProfileCard";
import "./NavBar.scss";
import HouseIcon from "~/components/graphics/icons/HouseIcon";
import NavLink from "./NavLink/NavLink";
import BurgerIcon from "~/components/graphics/icons/BurgerIcon";
import CalendarIcon from "~/components/graphics/icons/CalendarIcon";

export default function NavBar(props: RouteSectionProps) {
	return <div id="app-page">
		<nav id="app-page-nav">
			<ProfileCard />
			<hr />
			<div>
				<NavLink icon={HouseIcon} href="/home">Home</NavLink>
				<NavLink icon={CalendarIcon} href="/planning">Planning</NavLink>
				<NavLink icon={BurgerIcon} href="/menu">Menu</NavLink>
			</div>
		</nav>
		<main id="app-page-content">
			{props.children}
		</main>
	</div>;
}
