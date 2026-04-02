import { createSignal, JSX, Show, splitProps, createUniqueId } from "solid-js";

import "./TextInput.scss";

type TextInputProps = Omit<JSX.IntrinsicElements["input"], "onInvalid" | "onInput" | "type"> & {
	type?: "text" | "email" | "password" | "tel" | "url" | "search";
	invalid?: boolean;
	onInvalid?: ((event: Event) => void);
	onInput?: ((event: Event) => void);
};

type InvalidHandler = JSX.EventHandlerUnion<HTMLInputElement, Event, JSX.EventHandler<HTMLInputElement, Event>>;
type InputHandler = JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;

function getValidationMessage(input: HTMLInputElement): string {
	const { validity, type } = input;

	if (validity.customError) return input.validationMessage;
	if (validity.valueMissing) return `Please enter a ${type}`;
	if (validity.typeMismatch) return `Please enter a valid ${type}`;
	if (validity.tooShort) return "Too short";
	if (validity.tooLong) return "Too long";
	if (validity.patternMismatch) return "Invalid format";

	return input.validationMessage;
}

export default function TextInput(props: TextInputProps) {
	const [invalidMessage, setInvalidMessage] = createSignal("");
	const [local, rest] = splitProps(props, ["class", "invalid", "onInvalid", "onInput"]);

	const ariaMessageId = createUniqueId();

	const handleInvalid: InvalidHandler = (event) => {
		if (local.onInvalid) local.onInvalid(event);

		const input = event.currentTarget;
		setInvalidMessage(getValidationMessage(input));
		input.setCustomValidity("");

		if (event.defaultPrevented) return;
		event.preventDefault();
	};

	const handleInput: InputHandler = (event) => {
		if (local.onInput) local.onInput(event);
		if (event.defaultPrevented) return;
		setInvalidMessage("");
	};

	const isInvalid = () => !!invalidMessage();

	return <div class={`text-input ${local.class ?? ""}`}>
		<input onInvalid={handleInvalid} onInput={handleInput} aria-invalid={isInvalid()} aria-describedby={isInvalid()
			? ariaMessageId
			: undefined} {...rest} />
		<Show when={isInvalid()}>
			<p class="invalid-message" id={ariaMessageId}>
				{invalidMessage()}
			</p>
		</Show>
	</div>;
}
