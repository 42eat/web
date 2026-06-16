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
		ftAuthCallback: {
			mainErrorMessage: "EN: Une erreur imprévue s'est produite :/",
			subErrorMessage: "EN: Veuillez réessayer plus tard.",
			mainRefusedMessage: "EN: Vous avez refusé ToT",
			subRefusedMessage: "EN: Pas cool ...",
		},
		promptVerifyEmail: {
			title: "Vérifie ton email",
			mainContent: "On t'a envoyé un email à",
			description: "Clique sur le lien dans l'email pour activer ton compte.",
			spamMention: "Pense à vérifier tes spams si tu ne vois rien.",
			resendText: "Tu n'as rien reçu ?",
			resendLink: "Renvoyer l'email",
			logout: "Utiliser un autre compte",
		},
		confirmEmail: {
			title: "Vérifie ton email",
			loadingMessage: "On prépare tout, attends juste une petite seconde...",
			successMessage: "Tout est bon, ton compte est prêt !",
			successLink: "Aller à la page d'accueil",
			errorMessage: "Mmh... On a rencontré un problème :(",
			errorLink: "Retourner en lieu sûr",
		},
		requestPasswordReset: {
			title: "Réinitialiser votre mot de passe",
			description: "Entrez votre addresse email pour réinitialiser votre mot de passe.",
			rateLimit: "Vous pouvez renvoyer une addresse email dans {{time}}",
			success: "Si un compte est associé à cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe",
			input: {
				placeholder: "Adresse email",
			},
		},
		resetPassword: {
			title: "Modifier votre mot de passe",
			success: "Votre mot de passe a été modifié avec succès",
			error: "Ce lien n'est plus valide",
			invalidToken: "Votre lien a expiré",
			submitButton: "Modifier le mot de passe",
			inputs: {
				newPassword: "Nouveau mot de passe",
				confirmNewPassword: "Confirmer le nouveau mot de passe",
			},
		},
	},
	errors: {
		rateLimit: "Euh... Bro tu vas trop vite là !",
		unavailableFtApi: "We are not currently able to reach 42's API",
		unknownFallback: "Une erreur s'est produite, réessayez plus tard",
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
