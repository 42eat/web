import { createSignal, JSX, Show, splitProps, createMemo, createUniqueId } from "solid-js";

import "./TextInput.scss"

type TextInputProps = Omit<JSX.IntrinsicElements["input"], "onInvalid" | "onInput"> & {
	invalidMessage?: JSX.Element,
	invalid?: boolean,
	onInvalid?: ((event: Event) => void),
	onInput?: ((event: Event) => void),
}

export default function TextInput(props: TextInputProps) {
	const [isInvalid, setIsInvalid] = createSignal(false);
	const [local, rest] = splitProps(props, ["class", "invalid", "invalidMessage", "onInvalid", "onInput"]);

	const ariaMessageId = createUniqueId();

	function handleInvalid(event: Event) {
		if (local.onInvalid) local.onInvalid(event);
		if (event.defaultPrevented) return;
		setIsInvalid(true);
	}

	function handleInput(event: Event) {
		if (local.onInput) local.onInput(event);
		if (event.defaultPrevented) return;
		setIsInvalid(false);
	}

	const invalid = () => props.invalid ?? isInvalid();

	return <div class={`text-input ${local.class ?? ""}`}>
		<input onInvalid={handleInvalid} onInput={handleInput} aria-invalid={invalid()} aria-describedby={invalid() ? ariaMessageId : undefined} {...rest} />
		<Show when={invalid()}>
			<p class="invalid-message" id={ariaMessageId}>
				{local.invalidMessage ?? "Invalid input"}
			</p>
		</Show>
	</div>
}
