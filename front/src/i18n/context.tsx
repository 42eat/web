import * as i18n from "@solid-primitives/i18n";
import {
	useContext,
	createContext,
	createMemo,
	createSignal,
	JSXElement,
} from "solid-js";
import en from "./locales/en";
import fr from "./locales/fr";
import { setupZodErrorMap } from "./zodErrorMap";
import { Shape } from "~/types/generics/Shape";
import { z } from "zod";
import { env } from "~/env";

export const localeSchema = z.enum(["en", "fr"]);

export type Locale = z.infer<typeof localeSchema>;
export type RawDictionary = Shape<typeof en>;
export type Dictionary = i18n.Flatten<RawDictionary>;

export const dictionaries = {
	en,
	fr,
} as const satisfies Record<Locale, RawDictionary>;

type I18nContextType = {
	t: i18n.Translator<Dictionary>;
	locale: () => Locale;
	setLocale: (l: Locale) => void;
};

function getInitLang() {
	const browserLang = navigator.language.split("-")[0];
	const params = new URLSearchParams(location.search);
	const langValidation = localeSchema.safeParse(
		params.get("lang") || browserLang || env.VITE_DEFAULT_LANG,
	);
	let lang;
	if (langValidation.success) {
		lang = langValidation.data;
	} else {
		lang = env.VITE_DEFAULT_LANG;
	}
	return lang;
}

const I18nContext = createContext<I18nContextType>();

export function useTranslation() {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
	return ctx;
}

export type Translator = I18nContextType["t"];

export function I18nProvider(props: { children: JSXElement }) {
	const lang = getInitLang();
	const [locale, setLocale] = createSignal<Locale>(lang);

	const dict = createMemo<Dictionary>(() => i18n.flatten(dictionaries[locale()]));

	const t = i18n.translator(dict, i18n.resolveTemplate);

	setupZodErrorMap(t);

	return (
		<I18nContext.Provider value={{ t, locale, setLocale }}>
			{props.children}
		</I18nContext.Provider>
	);
}
