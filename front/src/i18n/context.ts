import { createI18nContext } from "@solid-primitives/i18n";
import fr from "./locales/fr";
import en from "./locales/en";

export type Locale = "en" | "fr";
export type Dict = typeof en;
export const i18nContext = createI18nContext({ en, fr }, "fr");
