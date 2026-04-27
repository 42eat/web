import { RawDictionary } from "../context";

export default {
	pages: {
		login: {
			error: {
				intraOnly: {
					begin: "FR: This account is only accessible with the ",
					link: "FR: 42's Intra login",
					end: "",
				},
				invalidCredentials: "FR: Invalid credential combination",
			},
		},
		verifyEmail: {
			title: "Vérifie ton email",
			mainContent: "On t'a envoyé un email à",
			description: "Clique sur le lien dans l'email pour activer ton compte.",
			spamMention: "Pense à vérifier tes spams si tu ne vois rien.",
			resendText: "Tu n'as rien reçu ?",
			resendLink: "Renvoyer l'email",
			logout: "Utiliser un autre compte",
		},
	},
	errors: {
		input: {
			text: {
				tooShort: "FR: Input too short",
				tooLong: "FR: Input too long",
				patternMismatch: "FR: Invalid input format",
				text: {
					valueMissing: "Ce champ est requis",
					typeMismatch: "FR: Une valeur valide est requise pour ce champ",
				},
				email: {
					valueMissing: "FR: Please enter an email",
					typeMismatch: "FR: Please enter a valid email",
				},
				password: {
					valueMissing: "FR: Please enter a password",
					typeMismatch: "FR: Please enter a valid password",
					confirmationMismatch: "FR: Password and confirmation password are different",
				},
				tel: {
					valueMissing: "FR: Please enter a phone number",
					typeMismatch: "FR: Please enter a valid phone number",
				},
				url: {
					valueMissing: "FR: Please enter a url",
					typeMismatch: "FR: Please enter a valid url",
				},
				search: {
					valueMissing: "FR: Please enter a research",
					typeMismatch: "FR: Please enter a valid research",
				},
			},
		},
		register: {
			conflictingEmail: "FR: This email is already taken",
		},
	},
} as const satisfies RawDictionary;
