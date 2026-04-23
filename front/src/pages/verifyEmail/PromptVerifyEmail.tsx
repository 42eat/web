import { onMount } from "solid-js";
import "./PromptVerifyEmail.scss";
import { authActions } from "~/store/auth.store";

export default function PromptVerifyEmail() {

	onMount(() => {
		/** `void` in js will ignore the return value of the following function.
			* It's mostly used to only silence warnings by providing a exhaustive
			* way to ignore return values of a function
			* (every function doesn't need void to ignore return values, but in
			* our case ignored `Promises` create warnings)*/
		void authActions.refreshToken();
	});
	return <p>VERIFIE TON EMAILLLLLLLL !!!!!!!!!!!!! </p>;
}
