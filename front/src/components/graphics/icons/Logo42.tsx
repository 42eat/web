import { JSX } from "solid-js/jsx-runtime";

export default function Logo42(props: JSX.IntrinsicElements["svg"]) {
	return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M0 16.4205H8.84197V20.8509H13.2536V12.8446H4.42768L13.2536 4H8.84197L0 12.8446V16.4205Z"/>
		<path d="M15.158 8.42768L19.5723 4H15.158V8.42768Z"/>
		<path d="M19.5723 8.42768L15.158 12.8446V17.2589H19.5723V12.8446L24 8.42768V4H19.5723V8.42768Z"/>
		<path d="M24 12.8446L19.5723 17.2589H24V12.8446Z"/>
	</svg>;
}
