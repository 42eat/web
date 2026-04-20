import { createContext, JSX, splitProps, useContext } from "solid-js";
import { InputComponentRef } from "~/types/ComponentRef";

type FormProps = JSX.IntrinsicElements["form"];

interface FormContextValue {
	register: (ref: InputComponentRef) => void;
	unregister: (ref: InputComponentRef) => void;
}


const FormContext = createContext<FormContextValue>();

export function useFormContext() {
	const result = useContext(FormContext);
	if (!result) throw Error("useFormContext should only be used inside a Form context provider.");
	return result;
}

type SubmitHandler = JSX.EventHandler<HTMLFormElement, SubmitEvent>;

export default function Form(props: FormProps) {
	const [local, rest] = splitProps(props, ["children", "novalidate", "onSubmit"]);

	const inputs: InputComponentRef[] = [];

	const contextValue: FormContextValue = {
		register: (ref: InputComponentRef) => inputs.push(ref),
		unregister: (ref) => inputs.splice(inputs.indexOf(ref), 1),
	};

	const handleSubmit: SubmitHandler = (e) => {
		e.preventDefault();
		if (!local.novalidate) {
			const inputErrors = inputs.map((ref) => ref.checkErrors());
			if (inputErrors.some((hasError) => hasError)) return console.log(inputErrors);
		}
		if (typeof local.onSubmit === "function") {
			local.onSubmit(e);
		}
	};

	return <FormContext.Provider value={contextValue}>
		<form onSubmit={handleSubmit} noValidate {...rest} >
			{local.children}
		</form>
	</FormContext.Provider>;
}
