import { A } from "@solidjs/router";

import "./RegisterForm.scss"
import Button from "~/components/ui/Button";
import TextInput from "~/components/ui/TextInput";

export default function RegisterForm() {
	return <form onSubmit={console.log} id="register-form">
		<div class="register-inputs">
			<TextInput type="text" placeholder="Display Name"></TextInput>
			<TextInput type="email" placeholder="Email"></TextInput>
			<TextInput type="password" placeholder="Password"></TextInput>
			<TextInput type="password" placeholder="Confirm password"></TextInput>
		</div>
		<p class="register-details">Already have an account? <A href="/auth/login">Login</A>.</p>
		<Button type="submit" onClick={console.log}>Register</Button>
		<div class="separator">
			<hr />OR<hr />
		</div>
		<Button class="ft-register-button" onClick={console.log}>Register with <p>42</p> Intra</Button>
	</form>
}
