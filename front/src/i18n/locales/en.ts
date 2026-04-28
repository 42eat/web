export default {
	pages: {
		login: {
			error: {
				intraOnly: {
					begin: "This account is only accessible with the ",
					link: "42's Intra login",
					end: "",
				},
				invalidCredentials: "Invalid credential combination",
			},
		},
		ftAuthCallback: {
			mainErrorMessage: "EN: Une erreur imprévue s'est produite :/",
			subErrorMessage: "EN: Veuillez réessayer plus tard.",
			mainRefusedMessage: "EN: Vous avez refusé ToT",
			subRefusedMessage: "EN: Pas cool ...",
		},
	},
	errors: {
		input: {
			text: {
				tooShort: "Input too short",
				tooLong: "Input too long",
				patternMismatch: "Invalid input format",
				text: {
					valueMissing: "Please fill this input",
					typeMismatch: "Please fill this input with a valid value",
				},
				email: {
					valueMissing: "Please enter an email",
					typeMismatch: "Please enter a valid email",
				},
				password: {
					valueMissing: "Please enter a password",
					typeMismatch: "Please enter a valid password",
					confirmationMismatch: "Password and confirmation password are different",
				},
				tel: {
					valueMissing: "Please enter a phone number",
					typeMismatch: "Please enter a valid phone number",
				},
				url: {
					valueMissing: "Please enter a url",
					typeMismatch: "Please enter a valid url",
				},
				search: {
					valueMissing: "Please enter a research",
					typeMismatch: "Please enter a valid research",
				},
			},
		},
		register: {
			conflictingEmail: "This email is already taken",
		},
	},
} as const;
