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
		verifyEmail: {
			title: "Check your email",
			mainContent: "We sent an email to",
			description: "Click the link in the email to activate your account.",
			spamMention: "Make sure to check your spam folder if you don't see anything.",
			resendText: "Didn't receive anything?",
			resendLink: "Resend the email",
			logout: "Use an other account",
		},
		requestPasswordReset: {
			title: "Reset your password",
			description: "If an account with this email address exists, we will send you an link to reset your password.",
			rateLimit: "You'll be able to resend an email in {{time}}",
			error: "An error occured, please retry later",
			success: "If you have an account at this address we sent you an email",
			input: {
				placeholder: "email",
			},
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
