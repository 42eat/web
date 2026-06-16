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
		promptVerifyEmail: {
			title: "Check your email",
			mainContent: "We sent an email to",
			description: "Click the link in the email to activate your account.",
			spamMention: "Make sure to check your spam folder if you don't see anything.",
			resendText: "Didn't receive anything?",
			resendLink: "Resend the email",
			logout: "Use an other account",
		},
		confirmEmail: {
			title: "Verify your email",
			loadingMessage: "We're getting everything ready, just hang tight for a second...",
			successMessage: "You're all set! Your account is ready to use.",
			successLink: "Go to the homepage",
			errorMessage: "Hmm... Something went wrong :(",
			errorLink: "Return to safety",
		},
		requestPasswordReset: {
			title: "Reset your password",
			description: "Enter your email address to reset your password.",
			rateLimit: "You'll be able to resend an email in {{time}}",
			success: "If an account with this email address exists, you will receive a link to reset your password",
			input: {
				placeholder: "Email address",
			},
		},
		resetPassword: {
			title: "Change your password",
			success: "Your password has successfully been changed",
			error: "This link is not valid anymore",
			invalidToken: "Your link is expired",
			submitButton: "Reset password",
			inputs: {
				newPassword: "New password",
				confirmNewPassword: "Confirm password",
			},
		},
	},
	errors: {
		rateLimit: "You are being rate limited",
		unavailableFtApi: "We are not currently able to reach 42's API",
		unknownFallback: "An error occurred, please try again later",
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
