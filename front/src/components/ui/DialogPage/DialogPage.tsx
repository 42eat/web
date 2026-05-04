import { JSX, splitProps } from "solid-js";
import "./DialogPage.scss";

type DialogPageProps = JSX.IntrinsicElements["dialog"];

export default function DialogPage(props: DialogPageProps) {
	const [local, rest] = splitProps(props, ["children", "class"]);

	return <main class="dialog-page">
		<div closedby="none" class={`dialog-page-section ${local.class ?? ""}`} {...rest}>
			{local.children}
		</div>
	</main>;
}
