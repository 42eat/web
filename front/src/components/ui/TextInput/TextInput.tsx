import { createSignal, JSX, Show, splitProps, createUniqueId, JSXElement, onCleanup } from "solid-js";

import "./TextInput.scss";
import { Translator, useTranslation } from "~/i18n/context";
import { InputComponentRef } from "~/types/ComponentRef";
import { useFormContext } from "../Form/Form";

type TextInputTypes = "text" | "email" | "password" | "tel" | "url" | "search";

type InvalidHandler = JSX.EventHandlerUnion<
	HTMLInputElement,
	Event,
	JSX.EventHandler<HTMLInputElement, Event>
>;

type TextInputProps = Omit<JSX.IntrinsicElements["input"], keyof TextInputComponentProps> & TextInputComponentProps;

interface TextInputComponentProps {
	/** In this context, `type` only used for semantic and "display" purposes (e.g password inputs).
	 * It is still important to provide it though for browser features, extensions, ...
	 * @see {@link TextInputComponentProps.validator} To provide validation checks that will be run
	 * by `ref.checkValidity` */
	type?: TextInputTypes;
	ref?: InputComponentRef | ((ref: InputComponentRef) => void);
	/** `validate` is the callback used by {@link InputComponentRefProperty.checkValidity} to validate input value.
	 * The JSXElement returned by the callback will be displayed if truish
	 */
	validator?: (element: HTMLInputElement) => JSXElement;
	onInvalid?: JSX.EventHandler<HTMLInputElement, Event>;
	onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
}


type InputHandler = JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;

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

function useTextInputFormContext() {
	try {
		return useFormContext();
	} catch (_) {
		throw new Error("<TextInput> should only be used inside a <Form> provider.");
	}
}

export default function TextInput(props: TextInputProps) {
	const [invalidMessage, setInvalidMessage] = createSignal<JSXElement>(null);
	const { t } = useTranslation();
	const formContext = useTextInputFormContext();
	const [local, rest] = splitProps(props, [
		"class",
		"validator",
		"onInvalid",
		"onInput",
		"ref",
	]);

	let componentRef!: InputComponentRef;

	onCleanup(() => formContext.unregister(componentRef));

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

	function checkErrors() {
		let error: JSXElement;
		if (rest.required && !componentRef.htmlElement.value) {
			error = t(`errors.input.text.${rest.type ?? "text"}.valueMissing`);
		} else {
			error = local.validator?.(componentRef.htmlElement);
		}
		setInvalidMessage(error);
		return !!error;
	}

	const isInvalid = () => !!invalidMessage();
	const ariaMessageId = createUniqueId();

	return <div class={`text-input ${local.class ?? ""}`}>
		<input
			onInvalid={handleInvalid}
			onInput={handleInput}
			aria-invalid={isInvalid()}
			aria-describedby={isInvalid()
				? ariaMessageId
				: undefined}
			ref={(el) => {
				componentRef = { htmlElement: el, checkErrors };
				formContext.register(componentRef);
				if (typeof local.ref === "function") {
					local.ref(componentRef);
				}
			}}
			{...rest}
		/>
		<Show when={isInvalid()}>
			<p class="invalid-message" id={ariaMessageId} aria-live="polite">
				{invalidMessage()}
			</p>
		</Show>
	</div>;
}
