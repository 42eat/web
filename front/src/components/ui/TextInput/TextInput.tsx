import { createSignal, JSX, Show, splitProps, createMemo } from "solid-js";

import "./TextInput.scss"

type TextInputProps = Omit<JSX.IntrinsicElements["input"], "onInvalid" | "onInput"> & {
	invalidMessage?: JSX.Element,
	onInvalid?: ((event: Event) => void),
	onInput?: ((event: Event) => void),
}

export default function TextInput(props: TextInputProps) {
	const [isInvalid, setIsInvalid] = createSignal(false);
	const [local, rest] = splitProps(props, ["class", "invalidMessage", "onInvalid", "onInput"]);

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

	const invalidMessageId = createMemo(() => crypto.randomUUID());

	return <div class={`text-input ${local.class ?? ""}`}>
		<input onInvalid={handleInvalid} aria-invalid={isInvalid()} onInput={handleInput} aria-describedby={invalidMessageId()} {...rest} />
		<Show when={isInvalid()}>
			<p class="invalid-message" id={`${invalidMessageId()}`}>
				{local.invalidMessage ?? "Invalid input"}
			</p>
		</Show>
	</div>
}
