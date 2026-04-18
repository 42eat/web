import { createSignal, JSX, Show, splitProps, createUniqueId } from "solid-js";

import "./TextInput.scss";
import { useTranslation } from "~/i18n/context";

type TextInputTypes = "text" | "email" | "password" | "tel" | "url" | "search";

type TextInputProps = Omit<
	JSX.IntrinsicElements["input"],
	"onInvalid" | "onInput" | "type"
> & {
	type?: TextInputTypes;
	invalid?: boolean;
	onInvalid?: JSX.EventHandler<HTMLInputElement, Event>;
	onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
};

type InvalidHandler = JSX.EventHandlerUnion<
	HTMLInputElement,
	Event,
	JSX.EventHandler<HTMLInputElement, Event>
>;
type InputHandler = JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;

type Translator = ReturnType<typeof useTranslation>["t"];

function getValidationMessage(input: HTMLInputElement, t: Translator): string {
	const validity = input.validity;

	/** We can assume that the only input type received here is
	 * the same as send to the TextInput component therefore
	 * cast is a decent solution for typing string. */
	const type = input.type as TextInputTypes;

	if (validity.customError) return input.validationMessage;
	if (validity.valueMissing) return t(`errors.input.text.${type}.valueMissing`);
	if (validity.typeMismatch) return t(`errors.input.text.${type}.typeMismatch`);
	if (validity.tooShort) return t("errors.input.text.tooShort");
	if (validity.tooLong) return t("errors.input.text.tooLong");
	if (validity.patternMismatch) return t("errors.input.text.patternMismatch");

	return input.validationMessage;
}

export default function TextInput(props: TextInputProps) {
	const [invalidMessage, setInvalidMessage] = createSignal("");
	const [local, rest] = splitProps(props, [
		"class",
		"invalid",
		"onInvalid",
		"onInput",
	]);

	const { t } = useTranslation();

	const ariaMessageId = createUniqueId();

	const handleInvalid: InvalidHandler = (event) => {
		if (local.onInvalid) local.onInvalid(event);

		const input = event.currentTarget;
		setInvalidMessage(getValidationMessage(input, t));
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
		<input
			onInvalid={handleInvalid}
			onInput={handleInput}
			aria-invalid={isInvalid()}
			aria-describedby={isInvalid()
				? ariaMessageId
				: undefined}
			{...rest}
		/>
		<Show when={isInvalid()}>
			<p class="invalid-message" id={ariaMessageId}>
				{invalidMessage()}
			</p>
		</Show>
	</div>;
}
